// libraries available from http://www.cs.princeton.edu/~traer/
import traer.physics.*;

// available from http://classic-web.archive.org/web/20060911111322/http://www.cs.princeton.edu/~traer/animation/
import traer.animation.*;

final float EDGE_LENGTH = 40;
final float EDGE_STRENGTH = 0.1;
final float CENTER_STRENGTH = 200000;
final float SPACER_STRENGTH = 500;

class ForceDirectedGraph extends ParticleSystem {
  Smoother3D centroid;
  Particle center;
  ForceDirectedGraph() {
    this(0.25, 0.8);
  }
  ForceDirectedGraph(float friction, float smoothness) {
    super(0, friction);
    center = makeParticle();
    center.makeFixed();
    centroid = new Smoother3D(smoothness);
    reset();
  }
  void reset() {
    clear();
    centroid.setValue(0, 0, 1);
  }
  void position() {
    translate( width/2 , height/2 );
    if(centroid.z() != 1)
      scale(centroid.z());
    translate(-centroid.x(), -centroid.y());
  }
  Vector3D remap(float x, float y) {
    return new Vector3D(
      centroid.x() + (x - width/2) / centroid.z(),
      centroid.y() + (y - height/2) / centroid.z(),
      0);
  }
  Particle addVertex() { 
    Particle p = makeParticle();
    for(int i = 0; i < numberOfParticles(); i++) {
      Particle t = getParticle(i);
      if(t != p)
        makeAttraction(p, t, -SPACER_STRENGTH, 0);
    }
    makeAttraction(p, center, CENTER_STRENGTH, min(width, height) / 2);
    return p;
  }
  Spring makeEdge(Particle a, Particle b) {
    return makeSpring(a, b, EDGE_STRENGTH, EDGE_STRENGTH, EDGE_LENGTH);
  }
  void updateCentroid() {
    float 
      xMax = Float.NEGATIVE_INFINITY, 
      xMin = Float.POSITIVE_INFINITY, 
      yMin = Float.POSITIVE_INFINITY, 
      yMax = Float.NEGATIVE_INFINITY;
      
    for(int i = 0; i < numberOfParticles(); i++) {
      Particle p = getParticle(i);
      xMax = max(xMax, p.position().x());
      xMin = min(xMin, p.position().x());
      yMin = min(yMin, p.position().y());
      yMax = max(yMax, p.position().y());
    }
    
    float deltaX = xMax - xMin;
    float deltaY = yMax - yMin;
    if (deltaY > deltaX)
      centroid.setTarget(xMin + 0.5 * deltaX, yMin + 0.5 * deltaY, constrain(height/(deltaY+50), 0, 1));
    else
      centroid.setTarget(xMin + 0.5 * deltaX, yMin + 0.5 * deltaY, constrain(width/(deltaX+50), 0, 1));
  }
  void time(float tickLength) {
    super.tick(tickLength);
    if(numberOfParticles() > 1)
      updateCentroid();
    centroid.tick();
  }
}
