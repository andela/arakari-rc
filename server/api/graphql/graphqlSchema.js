// Import type helpers from grapghql-js
import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString,
  GraphQLList, GraphQLID } from "graphql";

// Import some project data collections
import {Accounts, Orders, Products, Shops} from "/lib/collections";

const OrderItems = new GraphQLObjectType({
  name: "Ordered",
  description: "Details of Order Made",
  fields: () => ({
    title: { type: GraphQLString },
    quantity: { type: GraphQLString },
    price: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.variants.price;
      }
    }
  })
});

const OrdersType = new GraphQLObjectType({
  name: "Orders",
  description: "Order Status Details",
  fields: () => ({
    deliveryAddress: {
      type: ShippingAddress,
      resolve: (obj) => {
        return obj.shipping[0].address;
      }
    },
    email: { type: GraphQLString },
    _id: { type: GraphQLID },
    items: { type: new GraphQLList(OrderItems) },
    userId: { type: GraphQLString },
    workflowStatus: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.workflow.status;
      }
    },
    sessionId: { type: GraphQLString },
    shopId: { type: GraphQLString },
    orderDate: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.createdAt;
      }
    },
    shipped: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.shipping[0].shipped;
      }
    },
    tracking: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.shipping[0].tracking;
      }
    }
  })
});

const ProductsType = new GraphQLObjectType({
  name: "Products",
  description: "Lists select Product fields",
  fields: () => ({
    title: { type: GraphQLString },
    _id: { type: GraphQLString },
    vendor: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    price: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.price.range) {
          return obj.price.range;
        }
        return obj.price;
      }
    },
    inventoryQuantity: { type: GraphQLInt }
  })
});

const ShopsType = new GraphQLObjectType({
  name: "Shops",
  description: "Lists present Shops",
  fields: () => ({
    name: { type: GraphQLString },
    _id: { type: GraphQLID },
    status: { type: GraphQLString },
    currency: { type: GraphQLString },
    emails: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.emails[0].address;
      }
    },
    lastUpdated: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.updatedAt;
      }
    }
  })
});

const ShippingAddress = new GraphQLObjectType({
  name: "ShippingAddress",
  description: "Returns the Shipping Address",
  fields: () => ({
    fullName: { type: GraphQLString },
    streetAddress: { type: GraphQLString },
    city: { type: GraphQLString },
    region: { type: GraphQLString },
    country: { type: GraphQLString }
  })
});

const UsersType = new GraphQLObjectType({
  name: "Users",
  description: "A list of select user details",
  fields: () => ({
    fullName: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.profile.addressBook) {
          return obj.profile.addressBook[0].fullName;
        } else {
          return "No Name Found";
        }
      }
    },
    emails: {
      type: GraphQLString,
      resolve: (obj) => {
        if (!obj.emails.length) {
          return "No Email Found";
        } else {
          return obj.emails[0].address;
        }
      }
    },
    verified: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.emails.length) {
          return obj.emails[0].verified;
        } else {
          return null;
        }
      }
    },
    createdAt: { type: GraphQLString },
    userId: { type: GraphQLString },
    shopId: { type: GraphQLString }
  })
});

const query = new GraphQLObjectType({
  name: "Query",
  description: "GraphQL Server Config",
  fields: () => ({
    orders: {
      type: new GraphQLList(OrdersType),
      description: "Display Orders",
      args: {
        emailID: { type: GraphQLString },
        orderStatus: { type: GraphQLString }
      },
      resolve: (root, args) => {
        if (!args.emailID) {
          return "No params were passed";
        } else if (args.emailID === "admin" && args.orderStatus) {
          return Orders.find({ "workflow.status": args.orderStatus }).fetch();
        } else if (args.emailID === "admin") {
          return Orders.find().fetch();
        } else if (args.orderStatus) {
          return Orders.find(
            { "email": args.emailID, "workflow.status": args.orderStatus })
            .fetch();
        }
        return Orders.find({ email: args.emailID }).fetch();
      }
    },
    products: {
      type: new GraphQLList(ProductsType),
      description: "Display Products",
      resolve: () => {
        return Products.find().fetch();
      }
    },
    shops: {
      type: new GraphQLList(ShopsType),
      description: "Display Shops",
      resolve: () => {
        return Shops.find().fetch();
      }
    },
    users: {
      type: new GraphQLList(UsersType),
      description: "Display Users",
      resolve: () => {
        return Accounts.find().fetch();
      }
    }
  })
});

const schema = new GraphQLSchema({
  query
});

export default schema;
