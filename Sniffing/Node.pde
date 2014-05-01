import java.util.*;

float NodeSize = 20;
color cyan = #00abec, magenta =#ec008c, yellow = #ffee00;

class Node {
  Vector<Node> watching = new Vector<Node>();
  Vector<Spring> watchingSprings = new Vector<Spring>();

  ForceDirectedGraph fdg;
  Particle particle;

  String name;

  Node(String name, ForceDirectedGraph fdg) {
    this.name = name;
    this.fdg = fdg;
    this.particle = fdg.addVertex();
  }
  void watch(Node watch) {
    if(watching.contains(watch)) {
      return;
    }
    Spring cur = fdg.makeEdge(particle, watch.particle);
    watchingSprings.add(cur);
    watching.add(watch);
  }
  void clearWatching() {
    watchingSprings.clear();
    watching.clear();
  }
  void drawArrow() {
    noStroke();
    fill(yellow, 64);
    for (Node node : watching) {
      Vector3D
        axy = particle.position(), 
      bxy = node.particle.position();
      arrow(axy.x(), axy.y(), bxy.x(), bxy.y(), NodeSize);
    }
  }
  void drawNode() {
    noStroke();
    Vector3D xy = particle.position();
    if (follower()) {
      fill(cyan, 64);
      ellipse(xy.x(), xy.y(), NodeSize, NodeSize);
    }
    else {
      fill(magenta, 64);
      rect(xy.x()-NodeSize/2, xy.y()-NodeSize/2, NodeSize, NodeSize);
    }

    fill(0);
    noStroke();
    text(name, xy.x() - 2, xy.y() + 3);
  }
  boolean follower() {
    return watching.size() > 0;
  }
}

void arrow(float x1, float y1, float x2, float y2, float base) {
  float angle = atan2(y2 - y1, x2 - x1);
  float r = base / 2;
  float ax = x1 + cos(angle + HALF_PI) * r;
  float ay = y1 + sin(angle + HALF_PI) * r;
  float bx = x1 + cos(angle - HALF_PI) * r;
  float by = y1 + sin(angle - HALF_PI) * r;
  triangle(ax, ay, x2, y2, bx, by);
}

