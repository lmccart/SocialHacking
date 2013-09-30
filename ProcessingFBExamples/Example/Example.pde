// 1. Go to developers.facebook.com/apps and click "Create New App".
// 2. 

import facebook4j.Facebook;
import facebook4j.FacebookFactory;

import processing.net.*;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;


void setup() {

  String client_id = "167631416773261";
  String client_secret = "b9d3b8c809daeaaa07f5fcdc13de4010";
  String redirect_uri = "http://lauren-mccarthy.com/";
  
  // init empty
  String access_token = "";

  try
  {
    String url = "https://graph.facebook.com/oauth/access_token?client_id="+client_id+"&client_secret="+client_secret+"&grant_type=client_credentials,offline_access&redirect_uri="+redirect_uri;
    DefaultHttpClient httpClient = new DefaultHttpClient();
    HttpPost httpPost = new HttpPost( url );

    println( "executing request: " + httpPost.getRequestLine() );

    HttpResponse response = httpClient.execute( httpPost );
    HttpEntity entity = response.getEntity();

    println("----------------------------------------");
    println( response.getStatusLine() );
    println("----------------------------------------");

    String content = EntityUtils.toString(entity);
    String[] ind = content.split("access_token=");
    if (ind.length > 1) {
      access_token = ind[1];
      println("got access token: "+access_token);
    }
    EntityUtils.consume(entity);
    httpClient.getConnectionManager().shutdown();       

    /*
//    Client client = new Client(this, "127.0.0.1", 5204); 
     Client c = new Client(this, "https://graph.facebook.com", 80); // Connect to server on port 80
     c.write("GET /oauth/access_token?client_id=2710cdbc4e2fb5dd0bb9f2c9c1d5343a&grant_type=post HTTP/1.1\n"); // Use the HTTP "GET" command to ask for a Web page
     
     if (c.available() > 0) { // If there's incoming data from the client...
     String data = c.readString(); // ...then grab it and print it
     println(data);
     }
     */

    println("using token "+access_token);

    Facebook facebook = new FacebookFactory().getInstance();
    facebook.setOAuthAppId(client_id, client_secret);
    facebook.setOAuthPermissions("client_credentials");
    facebook.setOAuthAccessToken(new AccessToken(access_token, null));

    facebook.postStatusMessage("Hello from P5.");
  } 
  catch (Exception ex) {
    println(ex);
  }
}

void draw() {
}

