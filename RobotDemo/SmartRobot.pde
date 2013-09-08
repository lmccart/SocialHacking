import java.awt.*;
import java.awt.event.*;
import java.awt.event.KeyEvent;

public class SmartRobot extends Robot {

  int delayAmount = 10;
  
  public SmartRobot() throws AWTException {
    super();
  }

  public void keyType(int keyCode) {
    keyPress(keyCode);
    delay(delayAmount);
    keyRelease(keyCode);
  }

  public void keyType(int keyCode, int keyCodeModifier) {
    keyPress(keyCodeModifier);
    keyPress(keyCode);
    delay(delayAmount);
    keyRelease(keyCode);
    keyRelease(keyCodeModifier);
  }


  public void type(String text) {
    for (int i=0; i<text.length(); ++i) {
      type(text.charAt(i));
    }
  }

  private void type(char c) {
    boolean shift = true;
    int keyCode;

    switch (c) {
    case '~':
      keyCode = (int)'`';
      break;
    case '!':
      keyCode = (int)'1';
      break;
    case '@':
      keyCode = (int)'2';
      break;
    case '#':
      keyCode = (int)'3';
      break;
    case '$':
      keyCode = (int)'4';
      break;
    case '%':
      keyCode = (int)'5';
      break;
    case '^':
      keyCode = (int)'6';
      break;
    case '&':
      keyCode = (int)'7';
      break;
    case '*':
      keyCode = (int)'8';
      break;
    case '(':
      keyCode = (int)'9';
      break;
    case ')':
      keyCode = (int)'0';
      break;
    case ':':
      keyCode = (int)';';
      break;
    case '_':
      keyCode = (int)'-';
      break;
    case '+':
      keyCode = (int)'=';
      break;
    case '|':
      keyCode = (int)'\\';
      break;
    case '?':
      keyCode = (int)'/';
      break;
    case '{':
      keyCode = (int)'[';
      break;
    case '}':
      keyCode = (int)']';
      break;
    case '<':
      keyCode = (int)',';
      break;
    case '>':
      keyCode = (int)'.';
      break;
    default:
      if (Character.isUpperCase(c)) {
        keyCode = (int) c;
        shift = true;
      } 
      else {
        keyCode = (int) Character.toUpperCase(c);
        shift = false;
      }
    }
    if (shift) {
      keyType(keyCode, KeyEvent.VK_SHIFT);
    } 
    else {
      keyType(keyCode);
    }
  }
    
  void mouseMove(PVector position) {
    mouseMove((int) position.x, (int) position.y);
  }
  
  void mousePress(boolean mouseDown) {
    mousePress(mouseDown, LEFT);
  }
  
  void mousePress(boolean mouseDown, int side) {
    int mask = side == LEFT ? InputEvent.BUTTON1_MASK : InputEvent.BUTTON3_MASK;
    if(mouseDown) {
      mousePress(mask);
    } else {
      mouseRelease(mask);
    }
  }
  
  void mouseClick(int side) {
    mousePress(true, side);
    mousePress(false, side);
  }
  
  int lastScroll = 0;
  void mouseScroll(float scrollState) {
    int curScroll = (int) scrollState;
    if(curScroll != lastScroll) {
      mouseWheel(curScroll);
    }
    lastScroll = curScroll;
  }
  
  PVector getMouse() {
    Point p = MouseInfo.getPointerInfo().getLocation();
    return new PVector(p.x, p.y);
  }
}

