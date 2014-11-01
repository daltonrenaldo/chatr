Messages = new Mongo.Collection('messages');
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
