Messages = new Mongo.Collection('messages');

// prevents client to write to Messages collection
Messages.allow({});

if (Meteor.isClient) {
  Template.chat.helpers({
    messages: function () {
      return Messages.find({});
    },

    messageClass: function () {
      var isSelf = this.username == Meteor.user().username;
      var klass;
      if (isSelf) {
        klass = "self"
      } else {
        klass = "other"
      }

      return klass;
    }
  });

  Template.chat.events({
    'submit .input': function (event) {
      var text = event.target.msg.value; 

      // calls the server side Method that writes to the collection
      Meteor.call("addMessage", text);

      event.target.msg.value = "";

      return false;
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // removes all the messages when the server restart
    Messages.remove({});

    Meteor.methods({
      addMessage: function (text) {
        var user = Meteor.user().username;

        Messages.insert({
          text: text,
          username: user,
          createdAt: new Date()
        });
      }
    });
  });
}
