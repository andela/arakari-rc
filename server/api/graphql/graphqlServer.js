/* eslint no-console: 0 */
import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./graphqlSchema";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import axios from "axios";
import { Meteor } from "meteor/meteor";
import bcrypt from "bcrypt";
import SHA256 from "js-sha256";

const secret = process.env.SECRET || "wearethepirateswhodontdoanything";

const app = express();
const PORT = 9090;

app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true,
  pretty: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/api/login", Meteor.bindEnvironment((request, response) => {
  const user = (Meteor.users.find({"emails.address": request.body.email}).fetch());
  if (!user.length) {
    return response.send(404).send({message: "User doesn't exist"});
  }
  const password = request.body.password;
  const hash = user[0].services.password.bcrypt;
  return bcrypt.compare(SHA256(password), hash, (err, res) => {
    if (err) {
      return response.status(500).send(err);
    } else if (!res) {
      return response.status(401).send({message: "Authentication failed"});
    }
    const payload = { userId: user[0]._id };
    const token = jwt.sign(payload, secret, {expiresIn: "24h"});
    return response.status(200).send({message: "Login successful", token, expiresIn: "24h"});
  });
}));

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.headers["x-access-token"];
  if (!token) {
    return res.status(401)
    .send({ message: "Authentication failed" });
  }
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401)
      .send({ message: "Invalid token" });
    }
    req.decoded = decoded;
    return next();
  });
};

app.use(verifyToken);

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
