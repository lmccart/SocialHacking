class InstagramAPI {
  JSONArray raw;

  JSONArray load(String id) {
    String[] html = loadStrings("http://instagram.com/p/" + id + "/");
    String all = join(html, "");
    String regex = "window\\._jscalls = (\\[.+\\])\\;";
    String[] results = match(all, regex);
    saveStrings("raw.json", new String[] {
      results[1]
    }
    );
    raw = loadJSONArray("raw.json");
    return raw;
  }
  JSONObject getMedia() {
    return raw.getJSONArray(2).getJSONArray(2).getJSONObject(0).getJSONObject("props").getJSONObject("media");
  }
  JSONObject getLikes() {
    return getMedia().getJSONObject("likes");
  }
  String getCaption() {
    return getMedia().getString("caption");
  }
  String getLocationName() {
    return getMedia().getJSONObject("location").getString("name");
  }
  String getImage() {
    return getMedia().getString("display_src");
  }
  int getLikesCount() {
    return getLikes().getInt("count");
  }
}

