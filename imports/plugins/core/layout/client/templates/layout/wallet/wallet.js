import * as wallet from "./wallet.html";
import { Reaction } from "/client/api";
import { Template } from "meteor/templating";
import { Cart, Shops, Accounts, Packages, Wallets } from "/lib/collections";
import Alert from "sweetalert2";
import  { Meteor } from "meteor/meteor";
import bcrypt from "bcrypt-nodejs";

Template.wallet.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    details: {
      balance: 0
    }
  });
  this.autorun(() => {
    Meteor.call("wallets/getBalance", (err, res) => {
      Session.set("balance", res);
    });
    balance = Session.get("balance");
    this.state.set("details", balance);
  });
});

const payWithPaystack = amount => {
  const userAccountInfo = Accounts.find(Meteor.userId()).fetch();
  const emailAddress = userAccountInfo[0].emails[0].address;
  const handler = PaystackPop.setup({
    key: "pk_test_6860a0a85e1bbbb277c347e3e12e7f4373c8ba8c",
    email: emailAddress,
    amount: amount,
    reference: Math.random().toString(36).slice(-8),
    callback: (response) => {
      swal({
        title: "Successful",
        text: "The payment was successful.Transaction Reference Number is :" + response.reference,
        type: "success",
        timer: 2000,
        showConfirmButton: true
      });
      const amountNo = Number(amount);
      Meteor.call("wallets/updateWallet", amountNo);
    },
    onClose: () => {
      swal({
        title: "Payment Cancelled",
        text: "The payment process has been terminated",
        type: "error",
        timer: 5000,
        showConfirmButton: true
      });
    }
  });
  handler.openIframe();
};

Template.wallet.helpers({
  getBalance() {
    const balance = Template.instance().state.get("details");
    return balance;
  }
});

Template.wallet.events({
  "click #completeOrder": (event) => {
    event.preventDefault();
    const amount = document.getElementById("depositAmount").value;
    payWithPaystack(amount);
  }
});
