#include "testApp.h"

using namespace ofxCv;

void testApp::setup() {	
	tracker.setup();
	tracker.setIterations(25);
	tracker.setAttempts(4);
	
	src.loadImage("src.jpg");
	tracker.reset();
	tracker.update(toCv(src));
	srcPoints = tracker.getImagePoints();
	
	dst.loadImage("dst.jpg");
	tracker.reset();
	tracker.update(toCv(dst));
	
	ofMesh dstMesh = tracker.getImageMesh();
	dstMesh.clearTexCoords();
	dstMesh.addTexCoords(srcPoints);
	
	clone.setup(dst.getWidth(), dst.getHeight());
	ofFbo::Settings settings;
	settings.width = dst.getWidth();
	settings.height = dst.getHeight();
	maskFbo.allocate(settings);
	srcFbo.allocate(settings);
	
	maskFbo.begin();
	ofClear(0, 255);
	dstMesh.draw();
	maskFbo.end();
	
	srcFbo.begin();
	ofClear(0, 255);
	src.bind();
	dstMesh.draw();
	src.unbind();
	srcFbo.end();
	
	clone.setStrength(16);
	clone.update(srcFbo.getTextureReference(), dst.getTextureReference(), maskFbo.getTextureReference());
}

void testApp::draw() {
	ofSetColor(255);
	clone.draw(0, 0);
	
	ofTranslate(480, 0);
	srcFbo.draw(0, 0);
	
	ofTranslate(480, 0);
	maskFbo.draw(0, 0);
}