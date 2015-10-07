Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function () {
    return Tasks.find();
  });

}
 
if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe('tasks');

  Template.body.helpers({
    tasks: function () {
      Tasks.find({}).forEach(function(f) {
        console.log(f)
      });
      return Tasks.find({}, {sort: {identifier: -1}});
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
 
  Template.body.events({
    'click #add': function (e) {
      e.preventDefault();
      Tasks.insert({
        identifier: new Date().getTime()
      });
    },
    'submit #rules': function (e) {
      e.preventDefault();
      Tasks.find({}, {sort: {identifier:-1}}).forEach(function(r) {
        var a = event.target[r.identifier+'_a'].value;
        var b = event.target[r.identifier+'_b'].value;
        if (a && b) {
          Tasks.update({_id: r._id}, {$set: {a: String(a), b: String(b)}});
        }
      });
    }
  });

  Template.task.events({
    'click .remove': function () {
      Tasks.remove(this._id);
    }
  });
}