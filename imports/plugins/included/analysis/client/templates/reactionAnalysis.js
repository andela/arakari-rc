
import { Template } from "meteor/templating";
import Chart from 'chart.js';
import { Orders} from "/lib/collections";
const orderPrice = () => {
  const orders = Orders.find();
  return orders;
};

