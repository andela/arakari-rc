/* eslint no-console: 0 */
import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./graphqlSchema";
import axios from "axios";

const app = express();
const PORT = 9090;

app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true,
  pretty: true
}));

app.get("/api/users", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        users {
          fullName
          emails
          verified
          createdAt
          userId
          shopId
        }
      }`
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      response.status(200).json(res.data);
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/products", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        products {
          title
          _id
          vendor
          createdAt
          price
          inventoryQuantity
        }
      }`
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      response.status(200).json(res.data);
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/shops", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        shops {
          name
          _id
          status
          currency
          emails
          lastUpdated
        }
      }`
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      response.status(200).json(res.data);
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/ordered_items/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: "${emailID}") {
          deliveryAddress {
            fullName
            streetAddress
            city
            region
            country
          }
          email
          _id
          items {
            title
            quantity
            price
          }
          userId
          workflowStatus
          sessionId
          shopId
          orderDate
          shipped
          tracking
        }
      }`
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Orders Found");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/orders_processed/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: "${emailID}") {
          deliveryAddress {
            fullName
            streetAddress
            city
            region
            country
          }
          email
          _id
          items {
            title
            quantity
            price
          }
          userId
          workflowStatus
          sessionId
          shopId
          orderDate
          shipped
          tracking
        }
      }`
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Orders Found");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/orders_cancelled/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: "${emailID}") {
          deliveryAddress {
            fullName
            streetAddress
            city
            region
            country
          }
          email
          _id
          items {
            title
            quantity
            price
          }
          userId
          workflowStatus
          sessionId
          shopId
          orderDate
          shipped
          tracking
        }
      }`
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Orders Found");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.listen(PORT, () => {
  console.log("Node/Express server for GraphQL. listening on port", PORT);
});
