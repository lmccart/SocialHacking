// note: this is a dangerous sketch, be ready to hit 'esc'

SmartRobot robot;

void setup() {
  size(640, 360);
  try {
    robot = new SmartRobot();
  } catch (AWTException e) {
  }
}

void draw() {  
  robot.type("redrum");
  if(random(1) < .5) {
    robot.type("\n");
  }
  if(random(1) < .1) {
    robot.mouseMove((int) random(displayWidth), (int) random(displayHeight));
  }
}
