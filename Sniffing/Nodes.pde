import java.util.*;
class Nodes extends Vector<Node> {
  ForceDirectedGraph fdg;
  Nodes(ForceDirectedGraph fdg) {
    this.fdg = fdg;
  }
  boolean contains(String name) {
    for (int i = 0; i < size(); i++)
      if (get(i).name.equals(name))
        return true;
    return false;
  }
  Node add(String name) {
    if (contains(name)) {
      return get(name);
    }
    Node cur = new Node(name, fdg);
    cur.particle.position().set(
    random(-10, 10), 
    random(-10, 10), 
    0);
    add(cur);
    return cur;
  }
  Node get(int i) {
    return (Node) super.get(i);
  }
  Node get(String name) {
    for (int i = 0; i < size(); i++)
      if (get(i).name.equals(name))
        return get(i);
    return null;
  }
  Node getRandom() {
    return get((int) random(size()));
  }
  void update() {
    fdg.time(1);
  }
  void render() {
    pushMatrix();
    fdg.position(); 
    for (int i = 0; i < size(); i++) get(i).drawArrow();
    for (int i = 0; i < size(); i++) get(i).drawNode();
    popMatrix();
  }
  Node at(float x, float y) {
    for (int i = 0 ; i < size(); i++) {
      Vector3D xy = get(i).particle.position();
      float d = dist(x, y, xy.x(), xy.y());
      if (d < NodeSize/2)
        return get(i);
    }
    return null;
  }
  void connect(String a, String b) {
    add(a).watch(add(b));
  }
}

