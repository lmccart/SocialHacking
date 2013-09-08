// emoji at http://listography.com/jinyoung/art/emoji_list

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.util.*;

Robot robot;
String[] emoji;

void setup() {
  size(400, 400);
  try { 
    robot = new Robot();
  } 
  catch (AWTException e) {
    e.printStackTrace();
  }
  emoji = loadStrings("emoji.txt");
  println(emoji);
}

void draw() {
  TextTransfer textTransfer = new TextTransfer();
  String cur = emoji[(10 + frameCount) % emoji.length];
  textTransfer.setClipboardContents(cur);

  robot.keyPress(KeyEvent.VK_META);
  robot.keyPress(KeyEvent.VK_V);
  robot.keyRelease(KeyEvent.VK_V);
  robot.keyRelease(KeyEvent.VK_META);
  robot.keyPress(KeyEvent.VK_ENTER);
  robot.keyRelease(KeyEvent.VK_ENTER);

  delay(1000 * (int) random(1, 2));

  if (frameCount % emoji.length == 0) {
    Collections.shuffle(Arrays.asList(emoji));
  }
}

