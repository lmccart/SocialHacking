// Updated 9/15/13, based on tutorial by Jer Thorp http://blog.blprnt.com/blog/blprnt/updated-quick-tutorial-processing-twitter
// See http://twitter4j.org/en/code-examples.html for more examples and details.

// 1. Visit https://dev.twitter.com/ and login with your twitter username and password.
// 2. On the top right, click on your icon and then "My Applications" from the dropdown menu.
// 3. Click the "Create a new application" button" on the top right.
// 4. Fill in the form.
// 5. Once you’ve agreed to the developer terms, you’ll arrive at a page which shows the first 
// two of the four things that we need: the Consumer key and the Consumer secret. 
// To get the other two values that we need, click on the button that says ‘Create my access token’.
// 6. Fill in these four values as strings in the cb fields below.

// To post a tweet, you must update your token settings to Read and Write and Access DMs:
// 1. Click on the "Settings" tab.
// 2. Under "Application Type" choose "Read and Write and Access Direct Messages".
// 3. Click the "Update this Twitter application's settings" button. It may take a minute to take effect.


void setup() {
  
  ConfigurationBuilder cb = new ConfigurationBuilder();
  cb.setOAuthConsumerKey("consumer_key");
  cb.setOAuthConsumerSecret("consumer_secret");
  cb.setOAuthAccessToken("oauth_access_token");
  cb.setOAuthAccessTokenSecret("oauth_access_token_secret");
  
  
  Twitter twitter = new TwitterFactory(cb.build()).getInstance();
  
  try {
    String recipientId = "user_handle";
    String text = "test_message_to_send";
    DirectMessage message = twitter.sendDirectMessage(recipientId, text);
    println("Sent: " + message.getText() + " to @" + message.getRecipientScreenName());
  }
  catch (TwitterException te) {
    println("Couldn't connect: " + te);
  };
  
}

void draw() {
  
}
