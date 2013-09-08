#pragma once

#include "ofMain.h"

#define MIN_PRINTABLE_ASCII 0x20
#define MAX_PRINTABLE_ASCII 0x7E

class ofxString {
public:
	ofxString& operator+=(const int& key) {
		str.push_back(key);
		return *this;
	}
	int size() {
		return str.size();
	}
	void pop_front(int n = 1) {
		if(n > size()) str.clear();
		else str.erase(str.begin(), str.begin() + n);
	}
	void pop_back(int n = 1) {
		if(n > size()) str.clear();
		else str.erase(str.end() - n, str.end());
	}
	bool matchTail(string& find) {
		if(find.size() > size())
			return false;
		int start = size() - find.size();
		for(int i = 0; i < find.size(); i++) {
			char findChar = find[i];
			string targetStr = getMultibyteSymbol(str[start + i]);
			if(targetStr.size() != 1)
				return false;
			char targetChar = targetStr[0];
			if(targetChar != findChar)
				return false;
		}
		return true;
	}
	string asAscii() {
		string out;
		for(int i = 0; i < size(); i++)
			out += getAsciiSymbol(str[i]);
		return out;
	}
	string asMultibyte() {
		return substrMultibyte(0, size());
	}
	string substrMultibyte(int pos, int len) {
		string out;
		for(int i = pos; i < len;  i++)
			out += getMultibyteSymbol(str[i]);
		return out;
	}
	int last() {
		if(size() > 1)
			return str[size() - 1];
		return 0;
	}
	static bool isPrintable(int key) {
		return (getMultibyteSymbol(key).size() != 0);
	}
	static bool isAscii(int key) {
		return key >= MIN_PRINTABLE_ASCII && key <= MAX_PRINTABLE_ASCII;
	}
private:
	static string getMultibyteSymbol(int key) {
		if(isAscii(key)) {
			string asString;
			asString += key;
			return asString;
		}
		switch(key) {
			case OF_KEY_RETURN: return "\u21B5";
			case OF_KEY_LEFT: return "\u2190";
			case OF_KEY_UP: return "\u2191";
			case OF_KEY_RIGHT: return "\u2192";
			case OF_KEY_DOWN: return "\u2193";
		}
		return "";
	}
	static char getAsciiSymbol(int key) {
		if(isAscii(key))
			return (char) key;
		switch(key) {
			case OF_KEY_RETURN: return (char) 20;
			case OF_KEY_LEFT: return (char) 27;
			case OF_KEY_UP: return (char) 24;
			case OF_KEY_RIGHT: return (char) 26;
			case OF_KEY_DOWN: return (char) 25;
		}
		return '\0';
	}

	vector<int> str;
};
