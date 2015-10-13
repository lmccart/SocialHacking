
var peer;
var subs = {};
var connection;

var Rules = new Mongo.Collection('rules');

if (Meteor.isServer) {
  Meteor.publish('rules', function () {
    return Rules.find();
  });

}
 
if (Meteor.isClient) {
  Meteor.subscribe('rules');
  Session.setDefault('page', 'chat_page');

  var path = window.location.pathname.split('/');
  var user = '';
  for (var i=0; i<path.length; i++) {
    if (path[i] === 'setup') {
      Session.set('page', 'rules_page');
    } else if (path[i].length > 0) {
      user = path[i].toLowerCase();
    }
  }


  Template.body.helpers({
    page: function(){
      return Session.get('page');
    }
  });

  Template.rules_page.helpers({
    rulez: function () {
      return Rules.find({user: user}, {sort: {identifier: 1}});
    }
  })
 
  // Template.body.events({
  // });

  Template.rules_page.events({
    'click #add': function(e) {
      e.preventDefault();
      Rules.insert({
        identifier: new Date().getTime(),
        user: user
      });
    },
    'submit #rules': function(e) {
      e.preventDefault();
      Rules.find({user:user}, {sort: {identifier:1}}).forEach(function(r) {
        var a = event.target[r.identifier+'_a'].value;
        var b = event.target[r.identifier+'_b'].value;
        if (a && b) {
          Rules.update({_id: r._id}, {$set: {a: String(a), b: String(b)}});
        } else {
          Rules.remove({_id: r._id});
        }
      });
      window.location='/'+user;
    },
    'click .remove': function () {
      Rules.remove(this._id);
    }
  });

  Template.chat_page.events({
    /*'click #back_to_rules': function(e) {
      e.preventDefault();
      if (connection) connection.close();
      Session.set('page', 'rules_page');
    },*/
    'click #start': start,
    'keypress #pid': function(e) {
      if (e.charCode === 13) {
        start();
      }
    },
    'click #connect': connect,
    'keypress #rid': function(e) {
      if (e.charCode === 13) {
        connect();
      }
    },
    'click #send': send,
    'keypress #message': function(e) {
      if (e.charCode === 13) {
        send();
      }
    }
  });

  function start(pid) {
    console.log('start');
    var pid = $('#pid').val();
    peer = new Peer(pid, {
      key: 'x7fwx2kavpy6tj4i',
      debug: 3,
      logFunction: function() {
        var copy = Array.prototype.slice.call(arguments).join(' ');
        $('.log').append(copy + '<br>');
      }
    });

    peer.on('open', function(id){
      $('#name').html(id);
      $('#start').hide();
      $('#pid').hide();
      $('#connect_box').show();
      $('#wrap').show();
    });
    peer.on('connection', handleConnect);
    peer.on('error', function(err) { alert(err); });
  }

  function connect() {    
    var requestedPeer = $('#rid').val();
    var c = peer.connect(requestedPeer);
    c.on('open', function() { handleConnect(c); });
    c.on('error', function(err) { alert(err); });
  }


  function send() {
    var msg = $('#message').val();
    appendMessage('You', msg);
    $('#message').val('');
    $('#message').focus();
    for (var w in subs) {
      msg = msg.replace(w, subs[w]);
    }
    connection.send(msg);
  }

  // Handle a connection object.
  function handleConnect(c) {
    connection = c;

    Rules.find({user: user}, {sort: {identifier:1}}).forEach(function(r) {
      subs[r.a] = r.b;
    });
    console.log(subs);


    // Handle a chat connection.

    $('#connect_box').hide();
    $('#send_box').show();
    var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
    var header = $('<p></p>').html('Chat with <b>' + c.peer + '</b>');
    var messages = $('<div id="chatbox"><em>Peer connected.</em><br></div>').addClass('messages');
    $('#enterid').append(header);
    chatbox.append(messages);
 
    // Select connection handler.
    chatbox.on('click', function() {
      if ($(this).attr('class').indexOf('active') === -1) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
    $('#connections').append(chatbox);

    c.on('data', function(data) {
      appendMessage(c.peer, data);
    });
    c.on('close', function() {
      alert(c.peer + ' has left the chat.');
      chatbox.remove();
    });
  } 

  function appendMessage(sender, msg) {
    var s = sender.toLowerCase() === 'you' ? 'you' : 'peer';
    $('#chatbox').append('<span class="'+s+'"><b>'+sender+'</b></span>: '+msg+'<br>');
    $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
  }



  // // Make sure things clean up properly. // meh

  // window.onunload = window.onbeforeunload = function(e) {
  //   if (!!peer && !peer.destroyed) {
  //     peer.destroy();
  //   }
  // };


}