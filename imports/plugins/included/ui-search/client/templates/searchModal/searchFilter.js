import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import _ from "underscore";

Template.searchFilter.helpers({
  getBrands(products) {
    return _.uniq(_.pluck(products, "vendor"));
  }
});

Template.searchFilter.events({
  "change #price-filter": function (event) {
    Session.set("priceFilter", event.target.value);
  },
  "change #brand-filter": function (event) {
    Session.set("brandFilter", event.target.value);
  }
});

Template.sortRelevance.events({
  "change #sort-value": function (event) {
    Session.set("sortValue", event.target.value);
  }
});
