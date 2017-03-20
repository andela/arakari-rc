import {Wallets} from "/lib/collections";

Meteor.publish("transactionInfo", function (userId) {
  check(userId, String);
  return Wallets.find({
    userId
  });
});
