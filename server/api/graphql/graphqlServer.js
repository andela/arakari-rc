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

app.get("/api/ordered_products/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: "${emailID}") {
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
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
      response.status(404).send("No Data Found for Orders");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/processed_orders/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (
          emailID: "${emailID}",
          orderStatus: "coreOrderWorkflow/completed"
        )
        {
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
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
      response.status(404).send("No Data Found for Orders");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/cancelled_orders/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: "${emailID}",
        orderStatus: "coreOrderWorkflow/canceled"
        )
        {
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
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
      response.status(404).send("No Data Found for Orders");
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

app.get("/api/users", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        users {
          id
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

app.listen(PORT, () => {
 console.log('Node/Express server for GraphQL. listening on port', PORT);
});
