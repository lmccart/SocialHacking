void setup() {
  String id = "dGPNEVSfc7";
  InstagramAPI api = new InstagramAPI();
  api.load(id);
  println("likes count: " + api.getLikesCount());
  println("image: " + api.getImage());
  println("caption: " + api.getCaption());
  println("location name: " + api.getLocationName());
}
