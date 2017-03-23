import { Meteor } from "meteor/meteor";
import { Wallets, Accounts } from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";
import { check } from "meteor/check";
import bcrypt from "bcrypt-nodejs";

Meteor.methods({
  "wallet/pin": (userId, pin) => {
    check(userId, String);
    check(pin, Number);
    convertedPin = pin.toString();
    const hashedPin = bcrypt.hashSync(convertedPin, bcrypt.genSaltSync(8));
    try {
      Wallets.update({userId}, {$set: { userPin: hashedPin}});
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * wallet/deposit method to deposit money into user's account
   * @param {string} userId
   * @param {object} transactions
   * @return {boolean}
   */
  "wallet/transaction": (userId, transactions) => {
    check(userId, String);
    check(transactions, Schemas.Transactions);
    let balanceOptions;
    const { amount, transactionType } = transactions;
    if (transactionType === "Credit") {
      balanceOptions = { balance: amount };
    }
    if (transactionType === "Debit") {
      if (transactions.to) {
        const recipient = Accounts.findOne({ "emails.0.address": transactions.to });
        const sender = Accounts.findOne(userId);
        if (sender.emails[0].address === recipient) {
          return 3;
        }
        if (!recipient) {
          return 2;
        }
        // deposit for the recipient
        Meteor.call("wallet/transaction", recipient._id, {
          amount,
          from: sender.emails[0].address,
          date: new Date(),
          transactionType: "Credit"
        });
      }
      balanceOptions = { balance: -amount };
    }

    try {
      Wallets.update({ userId }, { $push: { transactions: transactions }, $inc: balanceOptions }, { upsert: true });
      return 1;
    } catch (error) {
      return 0;
    }
  },

  /**
   * wallet/refund method to return fund when an order is canceled
   * @param {string} orderInfo the id of the logged in user
   * @param {string} userId the order reference id
   * @param {int} amount the amount to refund
   * @return {boolean} true if the refund was successful
   */
  "wallet/refund": (orderInfo, userId) => {
    check(orderInfo, Schemas.Order);
    let amount = orderInfo.billing[0].invoice.total;
    if (orderInfo.workflow.status === "coreOrderWorkflow/completed") {
      amount -= orderInfo.billing[0].invoice.shipping;
    }
    const orderId = orderInfo._id;
    const transaction = { amount, orderId, transactionType: "Refund" };
    try {
      Wallets.update({ userId }, { $push: { transactions: transaction }, $inc: { balance: amount } }, { upsert: true });
      return true;
    } catch (error) {
      return false;
    }
  },

  "wallet/getUser": () => {
    return Accounts.findOne(Meteor.userId());
  },

  "wallets/updateWallet": (amount) => {
    check(amount, Number);

    Wallets.update({
      userId: Meteor.userId()
    }, {
      $inc: {
        balance: amount
      }
    });
  }
});
