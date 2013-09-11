<style>
* {
	font-family: sans-serif;
}
div {
	border: 1px solid black;
	margin: 1em;
	padding: 1em;
}
</style>

<?php

require_once('twitteroauth/twitteroauth.php');
require_once('config.php');

if (CONSUMER_KEY === '' || CONSUMER_SECRET === '' || CONSUMER_KEY === 'CONSUMER_KEY_HERE' || CONSUMER_SECRET === 'CONSUMER_SECRET_HERE') {
  echo 'You need a consumer key and secret to test the sample code. Get one from <a href="https://dev.twitter.com/apps">dev.twitter.com/apps</a>';
  exit;
}

// Build TwitterOAuth object with client credentials.
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);

// If method is set change API call made. Test is called by default.
$content = $connection->get('search/tweets', array('q' => '#socialhacking'));
file_put_contents("db.js", "db=".$content.";");

$json = json_decode($content, true);
$statuses = $json["statuses"];
?>

<h1><?php echo(count($statuses));?> results</h1>

<?php
foreach($statuses as $item) {
	$user = $item["user"];
	$text = $item["text"];
?>
	<div>
		<h2>
			<img src="<?php echo($user["profile_image_url"]);?>">
			<?php echo($user["name"]);?> (<?php echo($user["screen_name"]);?>)
		</h2>
		<p><?php echo($text);?></p>
	</div>
<?php
}
?>