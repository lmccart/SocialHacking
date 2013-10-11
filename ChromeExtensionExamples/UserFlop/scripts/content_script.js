//------------------DOC READY-------------------//

var friends = {};
var numPosts;
var site;

$(document).ready(function(){
    var host = window.location.hostname;
    if (host.indexOf('twitter') != -1) site = 'tw';
    else if (host.indexOf('facebook') != -1) site = 'fb';

    doFriendFlop();
    setInterval(doFriendFlop, 1000);
});


function doFriendFlop() {
    var t = 0;
    if (site == 'tw') 
        var t = $('.stream-items').find('.js-stream-item').length;
    else if (site == 'fb')
        var t = $('.uiStream').find('.uiStreamStory').length;
  
    if (t != numPosts) {
        numPosts = t;
        grabFriends();
        flopFriends();
    }
}

function grabFriends() {
    if (site == 'tw') {
        $('.js-stream-item').each(function() {
            if (!$(this).hasClass('mod')) {
                var header = $(this).find('.stream-item-header');//.css('background', 'red');
                var name = $(this).find('.stream-item-header .username b').html();
                var rt = $(this).find('.badge-retweeted').length;
                if (!(name in friends) && !rt) {
                    friends[name] = header.html();
                }
            }
        });
    } 
    else if (site == 'fb') {
        $('.uiStreamStory').each(function() {
            if (!$(this).hasClass('mod')) {
                var photo = $(this).find('.actorPhoto');
                var header = $(this).find('.uiStreamHeadline');
                var name = header.find('a').html();
                console.log(name);
                if (!(name in friends)) {
                    friends[name] = {photo: photo.html(), header: header.html()};
                }
            }
        });
    }
    //console.log(friends);
}

function flopFriends() {
    if (site == 'tw') {
        $('.js-stream-item').each(function() {
            // add different user
            if (!$(this).hasClass('mod')) {
                $(this).find('.stream-item-header').html(randomVal(friends));
                // mark as modified
                $(this).addClass('mod')
            }
        });
    }
    else if (site == 'fb') {
        $('.uiStreamStory').each(function() {
            // add different user
            if (!$(this).hasClass('mod')) {
                var f = randomVal(friends);
                $(this).find('.uiStreamHeadline').html(f.header);
                $(this).find('.actorPhoto').html(f.photo);
                // mark as modified
                $(this).addClass('mod')
            }
        });       
    }
}

//returns random value in key val array
function randomVal(obj) {
    var ret;
    var c = 0;
    for (var key in obj)
        if (Math.random() < 1/++c)
           ret = key;
    return obj[ret];
}

//returns true if string contains searched character
function contains(string, searchChar){
    if(string.indexOf(searchChar) != -1) return true;
    else return false;
}