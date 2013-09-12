<html>
<head>
<script src="http://codeorigin.jquery.com/jquery-2.0.3.min.js"></script>
<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet">
<script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/sugar/1.3.9/sugar.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js"></script>
<script src="http://platform.twitter.com/widgets.js" charset="utf-8"></script>

<style>
@import url(https://fonts.googleapis.com/css?family=Lato:300italic,700italic,300,700);
body {
	padding: 1em;
}
*,h1,h2 {
	font-family: Lato;
}
.profile-image {
	width: 24px;
	height: 24px;
}
th, td {
	text-align: center;
}
.clickable {
	cursor: hand;
}
tr td:first-child, tr th:first-child {
	text-align: left;
}
</style>
</head>
<body>

<h1>Appropriating Interaction Technologies</h1>

<h2><a href="https://twitter.com/search?q=%23socialhacking&f=realtime">#socialhacking</a></h2>

<?php
if(array_key_exists("update", $_GET)) {
	require_once('twitteroauth/twitteroauth.php');
	require_once('config.php');

	if (CONSUMER_KEY === '' || CONSUMER_SECRET === '' || CONSUMER_KEY === 'CONSUMER_KEY_HERE' || CONSUMER_SECRET === 'CONSUMER_SECRET_HERE') {
	  echo 'You need a consumer key and secret to test the sample code. Get one from <a href="https://dev.twitter.com/apps">dev.twitter.com/apps</a>';
	  exit;
	}

	// Build TwitterOAuth object with client credentials.
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);

	// If method is set change API call made. Test is called by default.
	$content = $connection->get('search/tweets', array('q' => '#socialhacking', 'count' => '100', 'result_type' => 'recent'));
	$json = json_decode($content, true);

	if($json == null || !array_key_exists("statuses", $json)) {
		echo "Error retrieving results from Twitter.";
		return;
	}

	if(file_exists("db.json")) {
		$db = json_decode(file_get_contents("db.json"), true);
	} else {
		$db = array();
	}

	$statuses = $json["statuses"];
	foreach($statuses as $newStatus) {
		$exists = false;
		foreach($db as $oldStatus) {
			if($newStatus["id"] == $oldStatus["id"]) {
				$exists = true;
				break;
			}
		}
		if(!$exists) {
			array_unshift($db, $newStatus);
		}
	}

	file_put_contents("db.json", json_encode($db));

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
} else {
	if(!file_exists("db.json")) {
		echo "<p>There is no saved cache of tweets, <a href='./?update'>update the database</a>.</p>";
	}
}
?>

<script>
statuses = <?php include 'db.json'; ?>;

assignments = [
	{date: "September 9, 2013", total: 3},
	{date: "September 16, 2013", total: 0},
	{date: "September 23, 2013", total: 0},
	{date: "September 30, 2013", total: 0},
	{date: "October 7, 2013", total: 0},
	{date: "October 21, 2013", total: 0},
	{date: "October 28, 2013", total: 0},
	{date: "November 4, 2013", total: 0},
	{date: "November 11, 2013", total: 0},
	{date: "November 18, 2013", total: 0},
	{date: "November 25, 2013", total: 0},
	{date: "December 2, 2013", total: 0},
];

now = new Date();

// remove retweets
statuses = statuses.findAll(function(status) {
	return !status.retweeted_status;
});

// get unique users, replace this with manual list
users = statuses.map(function(status) {
	return status.user.screen_name;
}).unique().sort();

// users = [
// 	"nyuaesthetic"
// ];

sorted = {};

document.write("<table class='table table-bordered table-striped table-condensed table-hover'>");
document.write("<thead><tr>");
document.write("<th>Person</th>");
assignments.each(function(assignment) {
	document.write("<th>" + new Date(assignment.date).toString("MMM d") + "</th>");
});
document.write("</tr></thead>");
document.write("<tbody>");
users.each(function(user) {
	userInfo = statuses.find(function(status) {
		return status.user.screen_name == user;
	}).user;
	document.write("<tr>");
	document.write(
		"<td>" +
		"<img src='" + userInfo.profile_image_url + "' class='profile-image'/> " +
		"<a href='http://twitter.com/" + userInfo.screen_name + "'>" + userInfo.name + "</a> " +
		//"<small>(" + userInfo.screen_name + ")</small>" +
		"</td>");
	assignments.each(function(assignment) {
		// get date range for this week
		startDate = new Date(assignment.date);
		endDate = startDate.clone().addWeeks(1);
		// find all tweets from this user in date range
		all = statuses.findAll(function(status) {
			return status.user.screen_name == user &&
				new Date(status.created_at).between(startDate, endDate);
		});
		sorted[user] = sorted[user] || {};
		sorted[user][assignment.date] = all;
		if(now.isBefore(startDate)) {
			// fill the future full of asterisks
			document.write("<td><span class='glyphicon glyphicon-asterisk btn-xs'></span></td>");
		} else {
			document.write("<td onmousedown='showTweets(\"" + user + "\",\"" + assignment.date + "\");' ");
			if(all.length == 0) {
				// no tweets shows red warning sign
				document.write("class='clickable danger'><span class='glyphicon glyphicon-warning-sign'></span>");
			} else if(all.length < assignment.total) {
				// some tweets shows yellow
				document.write("class='clickable warning'>");
			} else {
				// finished shows green full star
				document.write("class='clickable success'><span class='glyphicon glyphicon-star'></span>");
			}
			all.each(function(status) {
				// add link icons for each url
				status.entities.urls && status.entities.urls.each(function(url) {
					document.write("<a href='" + url.expanded_url + "'><span class='glyphicon glyphicon-link'></span></a>");
				});
				// add image icons for each media
				status.entities.media && status.entities.media.each(function(media) {
					document.write("<a href='" + media.expanded_url + "'><span class='glyphicon glyphicon-picture'></span></a>");
				});
			});
			document.write("</td>");
		}
	});
	document.write("</tr>");
});
document.write("</tbody>");
document.write("</table>");
</script>

<div id="tweets"></div>

<script>
function showTweets(user, date) {
	console.log(sorted[user][date]);
	$("#tweets").empty();
	$("#tweets").hide();
	sorted[user][date].each(function(status) {
		$("#tweets").prepend('<blockquote class="twitter-tweet"><a href="https://twitter.com/tweet/status/' + status.id_str + '"></a></blockquote>');
	});
	twttr.widgets.load();
	$("#tweets").show();
}
</script>
</body>
</html>