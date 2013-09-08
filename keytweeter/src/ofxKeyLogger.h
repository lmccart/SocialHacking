#pragma once

#include "ofMain.h"
#include "ofxThread.h"

class ofxKeyLogger : ofxThread {
public:
	ofxKeyLogger();
	ofEvent<ofKeyEventArgs>
		keyPressed, keyReleased;
protected:
	void sendKeyPress(int key);
	void sendKeyRelease(int key);
	void threadedFunction();

	#ifdef TARGET_WIN32
	char
		keyStates[256],
		prevKeyStates[256],
		asyncKeyStates[256],
		prevAsyncKeyStates[256];
	bool ready;

	int virtualKeyToOF(int key, WORD buffer[]);
	#endif
};
