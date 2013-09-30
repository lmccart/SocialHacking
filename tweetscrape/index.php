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
.glyphicon {
	margin: 0 2px;
}
.count {
	background-color: rgba(255, 255, 255, .8);
	font-size: 50%;
	margin-left: -10px;
	position: relative;
	top: 5px;
	padding: 2px;
}
.glyphicon-asterisk {
	color: #ccc;
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
	
	// Build TwitterOAuth object with client credentials.
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);

	// If method is set change API call made. Test is called by default.


	$students = array(
		"hanbyul-here",
		"juyoungp88",
		"ataraciuk",
		"m1keall1son",
		"lawn___mower",
		"carljamilkowski",
		"m4ckaroni",
		"harryhow",
		"iamsukim",
		"gal_sasson",
		"taranagupta",
		"dd_yj",
		"noterrain",
		"nyuaesthetic",
		"kwangde7"
	);


	$statuses = array();
	foreach($students as $u) {
		$content = $connection->get('statuses/user_timeline', array('screen_name' => $u, 'count' => '200', 'include_rts' => 'false'));
		$json = json_decode($content, true);
		foreach($json as $status) {
			if(stristr($status['text'], '#socialhacking')) {
				$statuses[] = $status;
			}
		}
	}


	if(file_exists("db.json")) {
		$db = json_decode(file_get_contents("db.json"), true);
	} else {
		$db = array();
	}

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
statuses = <?php include('db.json'); ?>;

classTime = "2:35PM";

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
userIds = statuses.map(function(status) {
	return status.user.id;
}).unique().sort();


sorted = {};

document.write("<table class='table table-bordered table-striped table-condensed table-hover'>");
document.write("<thead><tr>");
document.write("<th>Person</th>");
assignments.each(function(assignment) {
	document.write("<th>" + new Date(assignment.date).toString("MMM d") + "</th>");
});
document.write("</tr></thead>");
document.write("<tbody>");
userIds.each(function(userId) {
	userInfo = statuses.find(function(status) {
		return status.user.id == userId;
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
		startTime = Date.parse(classTime + " " + assignment.date);
		endTime = startTime.clone().addWeeks(1);
		// find all tweets from this user in date range
		all = statuses.findAll(function(status) {
			return status.user.id == userId &&
				new Date(status.created_at).between(startTime, endTime);
		});
		sorted[userId] = sorted[userId] || {};
		sorted[userId][assignment.date] = all;
		if(now.isBefore(startTime)) {
			// fill the future full of asterisks
			document.write("<td><span class='glyphicon glyphicon-asterisk btn-xs'></span></td>");
		} else {
			document.write("<td onmousedown='showTweets(\"" + userId + "\",\"" + assignment.date + "\");' ");
			if(all.length == 0) {
				// no tweets shows red warning sign
				document.write("class='clickable danger'><span class='glyphicon glyphicon-warning-sign'></span>");
			} else if(all.length < assignment.total) {
				// some tweets shows yellow
				document.write("class='clickable warning'>");
			} else {
				// finished shows green full star
				document.write("class='clickable success'><span class='glyphicon glyphicon-star-empty'></span>");
				if(all.length > assignment.total) {
					document.write("<span class='count'>" + all.length + "</span>");
				}
			}
			urls = [], media = [];
			all.each(function(status) {
				if(status.entities.urls) {
					urls = urls.concat(status.entities.urls);
				}
				if(status.entities.media) {
					media = media.concat(status.entities.media);
				}
			});
			if(urls.length > 0) {
				if(urls.length > 1) {
					document.write("<span class='glyphicon glyphicon-link'></span><span class='count'>" + urls.length + "</span>");
				} else {
					document.write("<a href='" + urls[0].expanded_url + "'><span class='glyphicon glyphicon-link'></span></a>");
				}
			}
			if(media.length > 0) {
				if(media.length > 1) {
					document.write("<span class='glyphicon glyphicon-picture'></span><span class='count'>" + media.length + "</span>");
				} else {
					document.write("<a href='" + media[0].expanded_url + "'><span class='glyphicon glyphicon-picture'></span></a>");
				}
			}
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