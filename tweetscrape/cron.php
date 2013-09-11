<?php

require_once('twitteroauth/twitteroauth.php');
require_once('config.php');

if (CONSUMER_KEY === '' || CONSUMER_SECRET === '' || CONSUMER_KEY === 'CONSUMER_KEY_HERE' || CONSUMER_SECRET === 'CONSUMER_SECRET_HERE') {
  echo 'You need a consumer key and secret to test the sample code. Get one from <a href="https://dev.twitter.com/apps">dev.twitter.com/apps</a>';
  exit;
}


/* Build TwitterOAuth object with client credentials. */
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);


/* If method is set change API call made. Test is called by default. */
$content = $connection->get('search/tweets', array('q' => '#socialhacking'));


for ($i=0; $i<count($response); $i++) { 	
	$arr = get_object_vars($response[$i]);
	$id = $arr['id'];
	$text = $arr['text'];
	
	// // tweet dm
	// $connection->post('statuses/update', array('status' => $text));
	
	// // destroy dm
	// $connection->post('direct_messages/destroy', array('id' => $id));
	
	echo $id;
}

?>