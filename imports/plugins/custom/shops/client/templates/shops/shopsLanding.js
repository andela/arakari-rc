import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { Shops } from "/lib/collections";

Template.shopsLanding.onCreated(function() {
  this.autorun(() => {
    const shops = []
    Meteor.call('shop/getShops', (err, res) => {
      Session.set('Shops', res)
    })
    const AllShops = Session.get('Shops')
    for (let i in AllShops) { shops.push(AllShops[i]) }
    Session.set('ShopItems', shops);
  });
});

Template.shopsLanding.helpers({
  shops() {
    return Session.get('ShopItems')
  }
});