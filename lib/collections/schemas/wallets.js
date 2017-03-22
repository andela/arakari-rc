import {SimpleSchema} from "meteor/aldeed:simple-schema";
/**
 * Wallet Schema with Transactions attached
 */
export const Transactions = new SimpleSchema({
  amount: {
    type: Number,
    decimal: true,
    label: "Amount"
  },
  transactionType: {
    type: String
  },
  referenceId: {
    type: String,
    optional: true
  },
  from: {
    type: String,
    optional: true
  },
  to: {
    type: String,
    optional: true
  },
  orderId: {
    type: String,
    optional: true
  },
  date: {
    type: Date
  }
});

export const Wallets = new SimpleSchema({
  userId: {
    type: "String",
    label: "User"
  },
  userPin: {
    type: "String",
    optional: true
  },
  transactions: {
    type: [Transactions],
    optional: true
  },
  balance: {
    type: Number,
    decimal: true,
    defaultValue: 0,
    optional: true
  }
});
