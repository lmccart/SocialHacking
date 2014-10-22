#!/usr/bin/env python

import re
from threading import Timer
import subprocess
from subprocess import call
import os.path
import sys

# config
interface = 'en0'
channels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

if len(sys.argv) > 1:
	channels = sys.argv[1:len(sys.argv)]

# run
hopTime = 1

airport = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'

call(['networksetup',
	'-setairportpower',
	interface, 'on'])

call(['sudo',
	airport,
	'--disassociate'])

channelIndex = int(0)
hopTimer = 0
def hopChannels():
	global channelIndex
	channelIndex += 1
	if channelIndex == len(channels):
		channelIndex = 0
	channel = channels[channelIndex]
	print('hopping to channel ' + str(channel))
	call(['sudo',
		airport,
		'--channel=' + str(channel)])
	global hopTimer
	hopTimer = Timer(hopTime, hopChannels)
	hopTimer.start()

print("Press Enter or CTRL-C at any time to quit.");

hopChannels()

try:
	input()
except:
	pass

hopTimer.cancel()
call(['networksetup',
	'-setairportpower',
	interface, 'off'])