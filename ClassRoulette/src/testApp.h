#pragma once

#include "ofMain.h"
#include "ofxCv.h"
#include "Clone.h"
#include "ofxFaceTracker.h"

class testApp : public ofBaseApp {
public:
	void setup();
	void draw();
	
	ofxFaceTracker tracker;
	
	ofImage src, dst;
	vector<ofVec2f> srcPoints;
	
	Clone clone;
	ofFbo srcFbo, maskFbo;
};
