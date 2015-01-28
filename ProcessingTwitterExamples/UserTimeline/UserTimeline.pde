// Updated 1/27/15
// See http://twitter4j.org/en/code-examples.html for more examples and details.

// 1. Visit https://apps.twitter.com/ and login with your twitter username and password.
// 2. Click the "Create a new application" button" on the top right.
// 3. Fill in the form.
// 4. Click on "Keys and Access Tokens". You should see the first two of the four things
//    that we need: the Consumer key and the Consumer secret. 
// 5. Next to "Access Level" click "Modify Permssions" and choose the access you want.
// 6. Return to the "Keys" tab and click the button that says "Create my access token".
// 7. Fill in these four values as strings in the cb fields below.

import twitter4j.conf.*; 
import twitter4j.api.*; 
import twitter4j.*; 
import java.util.*;  

ConfigurationBuilder cb;
Query query;
Twitter twitter;


void setup() {
  
  cb = new ConfigurationBuilder();
  cb.setOAuthConsumerKey("consumer_key");
  cb.setOAuthConsumerSecret("consumer_secret");
  cb.setOAuthAccessToken("oauth_access_token");
  cb.setOAuthAccessTokenSecret("oauth_access_token_secret");
  
  Twitter twitter = new TwitterFactory(cb.build()).getInstance();
  
  try {
    ArrayList statuses = (ArrayList) twitter.getHomeTimeline();
    System.out.println("Showing home timeline.");
    for (int i = 0; i < statuses.size(); i++) {
      Status s = (Status) statuses.get(i);
      println(s.getUser().getName() + ":" + s.getText());
    }
  }
  catch (TwitterException te) {
    println("Couldn't connect: " + te);
  };
  
}

void draw() {
  
}
