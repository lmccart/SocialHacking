#pragma once

#include "ofMain.h"
#include "ofxCv.h"
#include "Clone.h"
#include "ofxFaceTracker.h"

class testApp : public ofBaseApp {
public:
	void setup();
	void draw();
	void loadFace(string filename);
	void substitute(int srcIndex, int dstIndex);
	
	ofxFaceTracker tracker;
	
	vector<ofImage> images;
	vector<ofMesh> meshes;
	
	Clone clone;
	ofFbo srcFbo, maskFbo;
};
