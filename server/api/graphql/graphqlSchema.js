// Import type helpers from grapghql-js
import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList,
  GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLFloat } from "graphql";

// Import some project data collections
import {Accounts, Cart, Orders, Products, Shipping, Shops} from "/lib/collections";

const OrderItems = new GraphQLObjectType ({
  name: "Orders",
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

const OrderStatus = new GraphQLObjectType ({
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

const ProductsType = new GraphQLObjectType ({

});

const ShopsType = new GraphQLObjectType ({

});

const ShippingAddress = new GraphQLObjectType ({
  name: "ShippingAddress",
  description: "Returns the Shipping Address",
  fields: () => ({
    profileName: { type: GraphQLString },
    street_address: { type: GraphQLString },
    city: { type: GraphQLString },
    region: { type: GraphQLString },
    country: { type: GraphQLString }
  })
});

const UsersType = new GraphQLObjectType ({
  name: "Users",
  description: "A list of select user details",
  fields: () => ({
    id: { type: GraphQLString },
    profileName: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.profile.addressBook) {
          return obj.profile.addressBook[0].profileName;
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
          return;
        }
      }
    },
    createdAt: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.createdAt;
      }
    }
  })
});

const query = new GraphQLObjectType ({
  name: "Query",
  description: "GraphQL Server Config",
  fields: () => ({
    orders: {
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
    shipping: {
      type: new GraphQLList(ShippingAddress),
      description: "Display Shipping",
      resolve: () => {
        return Shipping.find().fetch();
      }
    },
    users: {
      type: new GraphQLList(UsersType),
      description: "Display Users",
      resolve: () => {
        return Accounts.find().fetch();
      }
    }
  }),
});

const schema = new GraphQLSchema({
 query
});

export default schema;
