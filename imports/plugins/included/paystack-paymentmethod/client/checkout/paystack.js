import "./paystack.html";
import { Reaction } from "/client/api";
import { Template } from "meteor/templating";
import { Cart, Shops, Accounts, Packages } from "/lib/collections";
import  { Meteor } from "meteor/meteor";

const orderPrice = () => {
  const cart = Cart.findOne();
  return parseInt(cart.cartTotal() * 100 * 3.06);
};

const payWithPaystack = () => {
  const userAccountInfo = Accounts.find(Meteor.userId()).fetch();
  const emailAddress = userAccountInfo[0].emails[0].address;
  const handler = PaystackPop.setup({
    key: "pk_test_6860a0a85e1bbbb277c347e3e12e7f4373c8ba8c",
    email: emailAddress,
    amount: orderPrice(),
    reference: Math.random().toString(36).slice(-8),
    callback: function (response) {
      swal({
            title: "Successful",
            text: "The payment was successful.Transaction Reference Number is :" + response.reference,
            type: "success",
            timer: 2000,
            showConfirmButton: true
          });
    },
    onClose: function(){
          swal({
                title: "Unsuccessful",
                text: "The payment process has been terminated",
                type: "error",
                timer: 5000,
                showConfirmButton: true
              });
      }
  });
  handler.openIframe();
};

Template.paystackPaymentForm.events({
  "click #completeOrder": (event) => {
    event.preventDefault();
    payWithPaystack();
  }
});
