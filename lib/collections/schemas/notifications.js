import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
 * Notifications Schema
 *
 * Adds user notifications to the database
 */
export const Notifications = new SimpleSchema ({
  userId: {
    type: String
  },
  name: {
    type: String
  },
  type: {
    type: String,
    optional: true
  },
  message: {
    type: String
  },
  orderId: {
    type: String
  }
});
