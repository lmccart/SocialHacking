#include "ofMain.h"
#include "ofAppGlutWindow.h"
#include "ofxCv.h"
#include "Clone.h"
#include "ofxFaceTracker.h"

using namespace ofxCv;

class ExponentialTimer {
protected:
	float period;
	float startTime, lastTime;
	int ticks, count;
	float halfLife;
	bool finish;
	int getTicks(float time) {
		float decayConstant = log(2) / halfLife;
		float exponentialDecay = exp(-decayConstant * time);
		return count * (1 - exponentialDecay);
	}
public:
	ExponentialTimer() :
	count(0),
	halfLife(0),
	lastTime(0),
	startTime(0),
	finish(false),
	ticks(0) {
	};
	void setup(int count, float halfLife) {
		this->count = count;
		this->halfLife = halfLife;
	}
	void reset() {
		startTime = 0;
		lastTime = 0;
		ticks = 0;
		finish = false;
	}
	bool getFinish() {
		bool cur = finish;
		finish = false;
		return cur;
	}
	bool getTick() {
		if(startTime == 0) {
			startTime = ofGetElapsedTimef();
		}
		float curTime = ofGetElapsedTimef() - startTime;
		int curTicks = getTicks(curTime);
		int lastTicks = getTicks(lastTime);
		if(curTicks + 1 < count) {
			lastTime = curTime;
			ticks += curTicks - lastTicks;
			if(ticks > 0) {
				ticks--;
				return true;
			} else {
				return false;
			}
		} else {
			finish = true;
			return false;
		}
	}
};


class ofApp : public ofBaseApp {
public:
	ofxFaceTracker tracker;
	
	vector<ofImage> images;
	vector<ofMesh> meshes;
	
	Clone clone;
	ofFbo srcFbo, maskFbo;
	
	ExponentialTimer bodyTimer, faceTimer;
	
	int srcIndex, dstIndex;
	vector<int> indices, bodyIndices, faceIndices;
	
	vector<ofVec2f> getPoints(const ofMesh& mesh) {
		vector<ofVec2f> points;
		for(int i = 0; i < mesh.getNumVertices(); i++) {
			points.push_back(mesh.getVertex(i));
		}
		return points;
	}
	
	void loadFace(string filename) {
		ofImage img;
		img.loadImage(filename);
		images.push_back(img);
		
		tracker.reset();
		tracker.update(toCv(img));
		ofMesh mesh= tracker.getImageMesh();
		meshes.push_back(mesh);
	}
	
	void setup() {
		tracker.setup();
		tracker.setIterations(30);
		tracker.setClamp(4);
		tracker.setAttempts(4);
		
		bodyTimer.setup(50, 1);
		faceTimer.setup(100, 2);
		
		ofFbo::Settings settings;
		settings.width = 480, settings.height = 720;
		maskFbo.allocate(settings);
		srcFbo.allocate(settings);
		clone.setup(settings.width, settings.height);
		
		ofDirectory dir;
		dir.listDir("faces");
		for(int i = 0; i < dir.size(); i++) {
			loadFace(dir.getPath(i));
			indices.push_back(i);
		}
	}
	
	void substitute(int srcIndex, int dstIndex) {
		ofMesh blendMesh = meshes[dstIndex];
		blendMesh.clearTexCoords();
		blendMesh.addTexCoords(getPoints(meshes[srcIndex]));
		
		maskFbo.begin();
		ofClear(0, 255);
		blendMesh.draw();
		maskFbo.end();
		
		srcFbo.begin();
		ofClear(0, 255);
		images[srcIndex].bind();
		blendMesh.draw();
		images[srcIndex].unbind();
		srcFbo.end();
		
		clone.setStrength(16);
		clone.update(srcFbo.getTextureReference(), images[dstIndex].getTextureReference(), maskFbo.getTextureReference());
	}
	
	template <class T>
	T popRandom(vector<T>& all) {
		int i = (int) ofRandom(all.size());
		T cur = all[i];
		all.erase(all.begin() + i);
		return cur;
	}
	
	void draw() {
		ofBackground(0);
		
		if(indices.size() > 0) {
			bool updateSubstitute = false;
			if(ofGetFrameNum() == 0 || bodyTimer.getTick()) {
				bodyIndices = indices;
				dstIndex = popRandom(bodyIndices);
				updateSubstitute = true;
			}
			if(ofGetFrameNum() == 0 || faceTimer.getTick()) {
				faceIndices = bodyIndices;
				srcIndex = popRandom(faceIndices);
				updateSubstitute = true;
			}
			if(faceTimer.getFinish()) {
				indices = faceIndices;
			}
			if(updateSubstitute) {
				substitute(srcIndex, dstIndex);
			}
		}
		
		ofSetColor(255);
		clone.draw(0, 0);
		
		ofPushMatrix();
		ofTranslate(480, 0);
		ofScale(.5, .5);
		images[srcIndex].draw(0, 0);
		images[dstIndex].draw(0, 720);
		ofPopMatrix();
		
		ofPushMatrix();
		ofTranslate(0, 720 * .9);
		ofScale(.1, .1);
		for(int i = 0; i < indices.size(); i++) {
			int cur = indices[i];
			images[cur].draw(0, 0);
			if(cur == srcIndex || cur == dstIndex) {
				ofPushStyle();
				ofSetColor(255, 128);
				ofNoFill();
				ofSetLineWidth(4);
				ofRect(0, 0, images[cur].getWidth(), images[cur].getHeight());
				ofPopStyle();
			}
			ofTranslate(480, 0);
		}
		ofPopMatrix();
	}
	
	void keyPressed(int key) {
		if(key == ' ') {
			bodyTimer.reset();
			faceTimer.reset();
		}
	}
};

int main() {
	ofAppGlutWindow window;
	ofSetupOpenGL(&window, 720, 720, OF_WINDOW);
	ofRunApp(new ofApp());
}
