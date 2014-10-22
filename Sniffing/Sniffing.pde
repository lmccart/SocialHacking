WifiMonitor monitor = new WifiMonitor();
Nodes m;
MacLookup macLookup;
PFont trebuchet;

void setup() {
  size(displayWidth, displayHeight);
  trebuchet = createFont("Helvetica", 9);
  textFont(trebuchet, 9);
  textAlign(CENTER, CENTER);
  m = new Nodes(new ForceDirectedGraph());
  macLookup = new MacLookup();
  monitor.start();
}

void draw() {
//  while(monitor.hasNewProbeRequestFrame())
  {
    ProbeRequestFrame cur = monitor.getNextProbeRequestFrame();
    if(cur != null) {
      cur.mac = cur.mac.toUpperCase();
      if(cur.ssid.equals("")) {
  //      m.add(cur.mac);
      } else {
        m.connect(macLookup.getSummary(cur.mac), cur.ssid);
      }
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
  if(key == 's') {
    saveFrame("out.png");
  }
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
