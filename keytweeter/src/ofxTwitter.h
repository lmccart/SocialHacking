#pragma once

#include "ofxThread.h"
#include <queue>

class ofxTwitter : ofxThread {
public:
	void send(string username, string password, string message) {
		string command =
			"curl -u " +
			username + ":" + password +
			" -d \"status=" + unquote(message) + "\" " +
			"http://twitter.com/statuses/update.json";
		commands.push(command);
		if(!isThreadRunning())
			startThread(true, false);
	}
protected:
	queue<string> commands;
	void threadedFunction() {
		while(commands.size() > 0) {
			string cur = commands.front();
			#ifdef TARGET_WIN32
			system(cur.c_str());
			#endif
			commands.pop();
		}
	}

	static string unquote(string quoted) {
		string unqouted;
		for(int i = 0; i < quoted.size(); i++)
			if(quoted[i] == '"')
				unqouted += "\\\"";
			else
				unqouted += quoted[i];
		return unqouted;
	}
};
