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
	tracker.setIterations(25);
	tracker.setAttempts(4);
	
	ofFbo::Settings settings;
	settings.width = 480, settings.height = 720;
	maskFbo.allocate(settings);
	srcFbo.allocate(settings);
	clone.setup(settings.width, settings.height);
	
	loadFace("src.jpg");
	loadFace("dst.jpg");
	
	ofMesh blendMesh = meshes[1];
	blendMesh.clearTexCoords();
	blendMesh.addTexCoords(getPoints(meshes[0]));
	
	maskFbo.begin();
	ofClear(0, 255);
	blendMesh.draw();
	maskFbo.end();
	
	srcFbo.begin();
	ofClear(0, 255);
	images[0].bind();
	blendMesh.draw();
	images[0].unbind();
	srcFbo.end();
	
	clone.setStrength(16);
	clone.update(srcFbo.getTextureReference(), images[1].getTextureReference(), maskFbo.getTextureReference());
}

void testApp::draw() {
	ofSetColor(255);
	clone.draw(0, 0);
	
	ofTranslate(480, 0);
	srcFbo.draw(0, 0);
	
	ofTranslate(480, 0);
	maskFbo.draw(0, 0);
}