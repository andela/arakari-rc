import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import * as Collections from "/lib/collections";
import { getShop } from "/server/imports/fixtures/shops";

Meteor.methods({
  
  "shop/vendorShop": function (vendorId, shopId) {
  	check(vendorId, String)
    check(shopId, String)

    const shop = getShop();

  	Collections.Accounts.update({
  		_id: vendorId
  	}, {
  		$set: {
  			"shopId": shopId
  		}
  	});
  }
});