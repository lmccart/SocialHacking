Rules = new Mongo.Collection('rules');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('rules', function () {
    return Rules.find();
  });

}
 
if (Meteor.isClient) {

  Meteor.subscribe('rules');
  Session.setDefault('page', 'rules_page');
  var subs = {};



  Template.body.helpers({
    page: function(){
      return Session.get('page');
    }
  });

  Template.rules_page.helpers({
    rulez: function () {
      return Rules.find({}, {sort: {identifier: 1}});
    }
  })
 
  Template.body.events({
    'click #add': function (e) {
      e.preventDefault();
      Rules.insert({
        identifier: new Date().getTime()
      });
    },
    'submit #rules': function (e) {
      e.preventDefault();
      Rules.find({}, {sort: {identifier:1}}).forEach(function(r) {
        var a = event.target[r.identifier+'_a'].value;
        var b = event.target[r.identifier+'_b'].value;
        if (a && b) {
          Rules.update({_id: r._id}, {$set: {a: String(a), b: String(b)}});
        } else {
          Rules.remove({_id: r._id});
        }
      });
      Session.set('page', 'chat_page');
    }
  });

  Template.rules_page.events({
    'click .remove': function () {
      Rules.remove(this._id);
    }
  });


  Meteor.startup(function() {

    var peer;
    var connectedPeers = {};

    // Handle a connection object.
    function connect(c) {

      Rules.find({}, {sort: {identifier:1}}).forEach(function(r) {
        subs[r.a] = r.b;
        console.log(r)
      });
      console.log(subs);


      // Handle a chat connection.
      if (c.label === 'chat') {

        $('#connect_box').hide();
        $('#chat_box').show();
        var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
        var header = $('<p></p>').html('Chat with <strong>' + c.peer + '</strong>');
        var messages = $('<div id="chatbox"><em>Peer connected.</em></div>').addClass('messages');
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
        $('.filler').hide();
        $('#connections').append(chatbox);

        c.on('data', function(data) {
          messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data +
            '</div>');
        });
        c.on('close', function() {
          alert(c.peer + ' has left the chat.');
          chatbox.remove();
          if ($('.connection').length === 0) {
            $('.filler').show();
          }
          delete connectedPeers[c.peer];
        });
      } 
      connectedPeers[c.peer] = 1;
    }

    function start(pid) {
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
      peer.on('connection', connect);
      peer.on('error', function(err) { console.log(err); });
    }

    //$(document).ready(function() {
      // Enter name
      $('#start').click(function() {
        var pid = $('#pid').val();
        start(pid);
      });

      // Connect to a peer
      $('#connect').click(function() {
        var requestedPeer = $('#rid').val();
        if (!connectedPeers[requestedPeer]) {
          // Create 2 connections, one labelled chat and another labelled file.
          var c = peer.connect(requestedPeer, {
            label: 'chat',
            serialization: 'none',
            metadata: {message: 'hi i want to chat with you!'}
          });
          c.on('open', function() {
            connect(c);
          });
          c.on('error', function(err) { alert(err); });
          var f = peer.connect(requestedPeer, { label: 'file', reliable: true });
          f.on('open', function() {
            connect(f);
          });
          f.on('error', function(err) { alert(err); });
        }
        connectedPeers[requestedPeer] = 1;
      });

      // Send a chat message to all active connections.
      $('#submit').click(function(e) {
        e.preventDefault();
        // For each active connection, send the message.
        var msg = $('#text').val();
        for (var w in subs) {
          msg = msg.replace(w, subs[w]);
        }
        eachActiveConnection(function(c, $c) {
          if (c.label === 'chat') {
            c.send(msg);
            $c.find('.messages').append('<div><span class="you">You: </span>' + msg
              + '</div>');
          }
        });
        $('#text').val('');
        $('#text').focus();
      });

      // Goes through each active peer and calls FN on its connections.
      function eachActiveConnection(fn) {
        var actives = $('.active');
        var checkedIds = {};
        actives.each(function() {
          var peerId = $(this).attr('id');

          if (!checkedIds[peerId]) {
            var conns = peer.connections[peerId];
            for (var i = 0, ii = conns.length; i < ii; i += 1) {
              var conn = conns[i];
              fn(conn, $(this));
            }
          }

          checkedIds[peerId] = 1;
        });
      }

      // Show browser version
      $('#browsers').text(navigator.userAgent);
    //});

    // Make sure things clean up properly.

    window.onunload = window.onbeforeunload = function(e) {
      if (!!peer && !peer.destroyed) {
        peer.destroy();
      }
    };

    });

}