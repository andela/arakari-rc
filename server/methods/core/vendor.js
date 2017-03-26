import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import * as Collections from "/lib/collections";
import { getCurrShop } from "/server/imports/fixtures/shops";

Meteor.methods({
  
  "shop/vendorShop": function (vendorId, shopId) {
  	check(vendorId, String)
    check(shopId, String)
    
    const shop = getCurrShop(vendorId);

  	Collections.Accounts.update({
  		_id: vendorId
  	}, {
  		$set: {
  			"shopId": shopId
  		}
  	});
  }
});