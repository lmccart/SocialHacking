#include "testApp.h"

using namespace ofxCv;

vector<ofVec2f> getPoints(const ofMesh& mesh) {
	vector<ofVec2f> points;
	for(int i = 0; i < mesh.getNumVertices(); i++) {
		points.push_back(mesh.getVertex(i));
	}
	return points;
}

void testApp::loadFace(string filename) {
	ofImage img;
	img.loadImage(filename);
	images.push_back(img);
	
	tracker.reset();
	tracker.update(toCv(img));
	ofMesh mesh= tracker.getImageMesh();
	meshes.push_back(mesh);
}

void testApp::setup() {
	tracker.setup();
	tracker.setIterations(30);
	tracker.setClamp(4);
	tracker.setAttempts(4);
	
	ofFbo::Settings settings;
	settings.width = 480, settings.height = 720;
	maskFbo.allocate(settings);
	srcFbo.allocate(settings);
	clone.setup(settings.width, settings.height);
	
	ofDirectory dir;
	dir.listDir("faces");
	for(int i = 0; i < dir.size(); i++) {
		loadFace(dir.getPath(i));
	}
	
	substitute(0, 1);
}

void testApp::substitute(int srcIndex, int dstIndex) {
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

void testApp::draw() {
	ofSetColor(255);
	clone.draw(0, 0);
	
	ofTranslate(480, 0);
	ofScale(.5, .5);
	images[0].draw(0, 0);
	images[1].draw(0, 720);
}