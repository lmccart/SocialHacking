WifiMonitor monitor = new WifiMonitor();
Nodes m;
PFont trebuchet;

void setup() {
  size(1280, 720);
  trebuchet = createFont("Helvetica", 9);
  textFont(trebuchet, 9);
  textAlign(CENTER, CENTER);
  m = new Nodes(new ForceDirectedGraph());
  monitor.start();
}

void draw() {
  while(monitor.hasNewProbeRequestFrame()) {
    ProbeRequestFrame cur = monitor.getNextProbeRequestFrame();
    cur.mac = cur.mac.toUpperCase();
    if(cur.ssid.equals("")) {
      m.add(cur.mac);
    } else {
      m.connect(cur.mac, cur.ssid);
    }
  }
  
  background(255);
  m.update();
  if(dragged != null) {
    Vector3D xy = m.fdg.remap(mouseX, mouseY);
    dragged.particle.position().set(xy.x(), xy.y(), 0);
  }
  m.render();
  
  pushStyle();
  pushMatrix();
  noFill();
  rectMode(CENTER);
  translate(width / 2, height / 2);
  stroke(0, 255 - min(255, monitor.timeSinceNewData()));
  ellipse(0, 0, 10, 10);
  ellipse(0, 0, 14, 14);
  popMatrix();
  popStyle();
}

void keyPressed() {
  // quick hack, doesn't work with stop button
  if (key == ESC) {
    monitor.quit();
  }
}

Node dragged;

void mousePressed() {
  Vector3D xy = m.fdg.remap(mouseX, mouseY);
  Node cur = m.at(xy.x(), xy.y());
  if(cur != null) {
      dragged = cur;
  }
}

void mouseReleased() {
  dragged = null;
}
