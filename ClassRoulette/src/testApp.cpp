#include "testApp.h"

using namespace ofxCv;

void testApp::setup() {
	cloneReady = false;
	
	dstTracker.setup();
	dstTracker.setIterations(25);
	dstTracker.setAttempts(4);
	
	srcTracker.setup();
	srcTracker.setIterations(25);
	srcTracker.setAttempts(4);
	
	src.loadImage("src.jpg");
	srcTracker.update(toCv(src));
	srcPoints = srcTracker.getImagePoints();
	
	dst.loadImage("dst.jpg");
	dstTracker.update(toCv(dst));
	
	clone.setup(dst.getWidth(), dst.getHeight());
	ofFbo::Settings settings;
	settings.width = dst.getWidth();
	settings.height = dst.getHeight();
	maskFbo.allocate(settings);
	srcFbo.allocate(settings);
	
	if(!dstTracker.getFound()) {
		ofLog() << "dst face not found";
	}
	if(!srcTracker.getFound()) {
		ofLog() << "src face not found";
	}
	
	if(dstTracker.getFound() && srcTracker.getFound()) {
		ofMesh dstMesh = dstTracker.getImageMesh();
		dstMesh.clearTexCoords();
		dstMesh.addTexCoords(srcPoints);
		
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
}

void testApp::draw() {
	ofSetColor(255);
	clone.draw(0, 0);
}