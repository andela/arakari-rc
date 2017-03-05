import { Template } from "meteor/templating";
import { Packages } from "/lib/collections";
import { PaystackPackageConfig } from "../../lib/collections/schemas";

import "./paystack.html";

Template.paystackSettings.helpers({
  PaystackPackageConfig () {
    return PaystackPackageConfig;
  },
  packageData () {
    return Packages.findOne({
      name: "reaction-paystack",
       shopId: Reaction.getShopId()
    });
  }
});

AutoForm.hooks({
  "paystack-update-form": {
    onSuccess: function () {
      Alerts.removeSeen();
      return Alerts.add("Paystack settings saved.", "success", {
        autoHide: true
      });
    },
    onError: function (operation, error) {
      Alerts.removeSeen();
      return Alerts.add("Paystack settings update failed. " + error, "danger");
    }
  }
});
