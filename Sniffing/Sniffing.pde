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
}

void keyPressed() {
  // quick hack, doesn't work with stop button
  if (key == ESC) {
    monitor.quit();
    exit();
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
