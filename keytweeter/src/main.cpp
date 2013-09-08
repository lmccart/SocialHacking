#include "ofMain.h"
#include "AutoTweet.h"
#include "ofxXmlSettings.h"

int main() {
	ofxXmlSettings settings;
	if (!settings.loadFile("config.xml")) {
		cout << "Unable to load data/config.xml" << endl;
		return 1;
	}

	string username = settings.getValue("username", "");
	string password = settings.getValue("password", "");
	cout << "Using account " << username << "/" << password << endl;

	AutoTweet autoTweet(username, password);

	int nsafe = settings.getNumTags("safe");
	for(int i = 0; i < nsafe; i++) {
		string cur = settings.getValue("safe", "", i);
		autoTweet.addSafeWord(cur);
		cout << "Safe: " << cur << " (" << cur.size() << ")" << endl;
	}

	autoTweet.run();
}
