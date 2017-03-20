import { Packages, Shops, Wallets, Cart } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import Alert from "sweetalert2";

const openClassName = "in";

Template.corePaymentMethods.onCreated(function () {
  // Set the default paymentMethod
  // Note: we do this once, so if the admin decides to change the default payment method
  // while a user is trying to checkout, they wont get a jarring experience.
  const shop = Shops.findOne();

  this.state = new ReactiveDict();
  this.state.setDefault({
    defaultPaymentMethod: shop.defaultPaymentMethod || "none"
  });
});

Template.corePaymentMethods.helpers({
  isOpen(current) {
    const instance = Template.instance();
    const state = instance.state;
    const name = current.packageName;
    const priority = current.priority;

    if (state.equals("defaultPaymentMethod", name) || priority === "0" && state.equals("defaultPaymentMethod", "none")) {
      return openClassName;
    }
  },
  appDetails: function () {
    // Provides a fallback to the package icon / label if one is not found for this reaction app
    const self = this;
    if (!(this.icon && this.label)) {
      const app = Packages.findOne(this.packageId);
      for (const registry of app.registry) {
        if (!(registry.provides === "dashboard")) {
          continue;
        }
        self.icon = registry.icon;
        self.label = registry.label;
      }
    }
    return self;
  }
});
Template.WalletPay.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.set("details", { balance: 0 });
  this.autorun(() => {
    this.subscribe("transactionInfo", Meteor.userId());
    const transactionDetail = Wallets.find().fetch();
    this.state.set("details", transactionDetail[0]);
  });
});
Template.WalletPay.events({
  "click #wallet-pay": (event) => {
    event.preventDefault();
    const balances = Template.instance().state.get("details").balance;
    const cartAmounts = parseFloat(Cart.findOne({userId: Meteor.userId()}).cartTotal(), 10);
    const pin = parseInt(document.getElementById("walletpin").value, 10);
    const convertedPin = pin.toString();
    const walletPin = Wallets.find().fetch()[0].userPin.toString();

    if (walletPin === convertedPin) {
      Alert({
        title: "Are you sure you want to Purchase this product?",
        text: "Funds will be deducted from your wallet",
        type: "warning",
        showConfirmButton: true,
        cancelButtonText: "Dismiss",
        showCancelButton: true
      }).then(() => {
        const cartAmount = cartAmounts;
        const balance = balances;
        if (cartAmount > balance) {
          Alerts.toast("Insufficient balance", "error");
          return false;
        }
        const currency = Shops.findOne().currency;
        transactionId = Random.id();
        Meteor.call("wallet/transaction", Meteor.userId(), {
          amount: cartAmount,
          date: new Date(),
          orderId: transactionId,
          transactionType: "Debit"
        }, (err, res) => {
          if (res) {
            const paymentMethod = {
              processor: "Wallet",
              storedCard: "",
              method: "Wallet",
              transactionId,
              currency: currency,
              amount: cartAmount,
              status: "passed",
              mode: "authorize",
              createdAt: new Date(),
              transactions: []
            };
            const theTransaction = {
              amount: cartAmount,
              transactionId,
              currency: currency
            };
            paymentMethod.transactions.push(theTransaction);
            Meteor.call("cart/submitPayment", paymentMethod);
            Alerts.toast("Payment Successful", "success");
          } else {
            Alerts.toast("An error occured, please try again", "error");
            return false;
          }
          return true;
        });
        return true;
      }, (dismiss) => {
        return dismiss === "cancel" ? false : true;
      });
    } else {
      Alerts.toast("Invalid Pin", "error");
      return false;
    }
    return true;
  }
});

Template.WalletPay.helpers({
  balance: () => {
    return Template.instance().state.get("details");
  }
});
