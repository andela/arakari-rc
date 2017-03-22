import _ from "lodash";
import React from "react";
import { DataType } from "react-taco-table";
import { Template } from "meteor/templating";
import { i18next } from "/client/api";
import { Session } from "meteor/session";
import { ProductSearch, Tags, OrderSearch, AccountSearch } from "/lib/collections";
import { IconButton, SortableTable } from "/imports/plugins/core/ui/client/components";

/*
 * searchModal extra functions
 */
function tagToggle(arr, val) {
  if (arr.length === _.pull(arr, val).length) {
    arr.push(val);
  }
  return arr;
}

/*
 * searchModal onCreated
 */
Template.searchModal.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    initialLoad: true,
    slug: "",
    canLoadMoreProducts: false,
    searchQuery: "",
    productSearchResults: [],
    tagSearchResults: []
  });


  // Allow modal to be closed by clicking ESC
  // Must be done in Template.searchModal.onCreated and not in Template.searchModal.events
  $(document).on("keyup", (event) => {
    if (event.keyCode === 27) {
      const view = this.view;
      $(".js-search-modal").fadeOut(400, () => {
        $("body").css("overflow", "visible");
        Blaze.remove(view);
      });
    }
  });

  // Filter products by price
const priceFilter = (products, query) =>  {
  return _.filter(products, (product) => {
    if (product.price) {
      const productMaxPrice = parseFloat(product.price.max);
      const productMinPrice = parseFloat(product.price.min);
      const queryMaxPrice = parseFloat(query[1]);
      const queryMinPrice = parseFloat(query[0]);
      if (productMinPrice >= queryMinPrice && productMaxPrice <= queryMaxPrice) {
        return product;
      }
      return false;
    }
  });
};
// Sort products by price
const sort = (products, type) => {
  return products.sort((a, b) => {
    const A = a.price === null ? -1 : a.price.min;
    const B = b.price === null ? -1 : b.price.min;
    if (A < B) {
      return type === "DESC" ? 1 : -1;
    } else if (A > B) {
      return type === "ASC" ? 1 : -1;
    }
    return 0;
  });
};


// Filter products by brand
function brandFilter(products, query) {
  return _.filter(products, (product) => {
    return product.vendor === query;
  });
}

// Filter products by shop
function shopFilter(products, query) {
  return _.filter(products, (product) => {
    return product.shopId === query;
  });
}

  this.autorun(() => {
    const searchCollection = this.state.get("searchCollection") || "products";
    const searchQuery = this.state.get("searchQuery");
    const priceQuery = Session.get("priceFilter");
    const brandQuery = Session.get("brandFilter");
    const sortQuery = Session.get("sortValue");
    const facets = this.state.get("facets") || [];
    const sub = this.subscribe("SearchResults", searchCollection, searchQuery, facets);

    if (sub.ready()) {
      /*
       * Product Search
       */
      if (searchCollection === "products") {
        let productResults = ProductSearch.find().fetch();
        if (!["null", "all"].includes(priceQuery) && priceQuery) {
          const range = priceQuery.split("-");
          productResults =  priceFilter(productResults, range);
        }
        if (!["null", "all"].includes(brandQuery) && brandQuery) {
          productResults = brandFilter(productResults, brandQuery);
        }
        if (sortQuery !== "null" && sortQuery) {
          productResults = sort(productResults, sortQuery);
        }
        const productResultsCount = productResults.length;
        this.state.set("productSearchResults", productResults);
        this.state.set("productSearchCount", productResultsCount);

        const hashtags = [];
        for (const product of productResults) {
          if (product.hashtags) {
            for (const hashtag of product.hashtags) {
              if (!_.includes(hashtags, hashtag)) {
                hashtags.push(hashtag);
              }
            }
          }
        }
        const tagResults = Tags.find({
          _id: { $in: hashtags }
        }).fetch();
        this.state.set("tagSearchResults", tagResults);

        // TODO: Do we need this?
        this.state.set("accountSearchResults", "");
        this.state.set("orderSearchResults", "");
      }

      /*
       * Account Search
       */
      if (searchCollection === "accounts") {
        const accountResults = AccountSearch.find().fetch();
        const accountResultsCount = accountResults.length;
        this.state.set("accountSearchResults", accountResults);
        this.state.set("accountSearchCount", accountResultsCount);

        // TODO: Do we need this?
        this.state.set("orderSearchResults", "");
        this.state.set("productSearchResults", "");
        this.state.set("tagSearchResults", "");
      }

      /*
       * Order Search
       */
      if (searchCollection === "orders") {
        const orderResults = OrderSearch.find().fetch();
        const orderResultsCount = orderResults.length;
        this.state.set("orderSearchResults", orderResults);
        this.state.set("orderSearchCount", orderResultsCount);


        // TODO: Do we need this?
        this.state.set("accountSearchResults", "");
        this.state.set("productSearchResults", "");
        this.state.set("tagSearchResults", "");
      }
    }
  });
});


/*
 * searchModal helpers
 */
Template.searchModal.helpers({
  IconButtonComponent() {
    const instance = Template.instance();
    const view = instance.view;

    return {
      component: IconButton,
      icon: "fa fa-times",
      kind: "close",
      onClick() {
        $(".js-search-modal").fadeOut(400, () => {
          $("body").css("overflow", "visible");
          Blaze.remove(view);
        });
      }
    };
  },
  productSearchResults() {
    const instance = Template.instance();
    const results = instance.state.get("productSearchResults");
    return results;
  },
  tagSearchResults() {
    const instance = Template.instance();
    const results = instance.state.get("tagSearchResults");
    return results;
  },
  showSearchResults() {
    return false;
  }
});


/*
 * searchModal events
 */
Template.searchModal.events({
  // on type, reload Reaction.SaerchResults
  "keyup input": (event, templateInstance) => {
    event.preventDefault();
    const searchQuery = templateInstance.find("#search-input").value;
    templateInstance.state.set("searchQuery", searchQuery);
    $(".search-modal-header:not(.active-search)").addClass(".active-search");
    if (!$(".search-modal-header").hasClass("active-search")) {
      $(".search-modal-header").addClass("active-search");
    }
  },
  "click [data-event-action=filter]": function (event, templateInstance) {
    event.preventDefault();
    const instance = Template.instance();
    const facets = instance.state.get("facets") || [];
    const newFacet = $(event.target).data("event-value");

    tagToggle(facets, newFacet);

    $(event.target).toggleClass("active-tag btn-active");

    templateInstance.state.set("facets", facets);
  },
  "click [data-event-action=productClick]": function () {
    const instance = Template.instance();
    const view = instance.view;
    $(".js-search-modal").delay(400).fadeOut(400, () => {
      Blaze.remove(view);
    });
  },
  "click [data-event-action=clearSearch]": function (event, templateInstance) {
    $("#search-input").val("");
    $("#search-input").focus();
    const searchQuery = templateInstance.find("#search-input").value;
    templateInstance.state.set("searchQuery", searchQuery);
  },
  "click [data-event-action=searchCollection]": function (event, templateInstance) {
    event.preventDefault();
    const searchCollection = $(event.target).data("event-value");

    $(".search-type-option").not(event.target).removeClass("search-type-active");
    $(event.target).addClass("search-type-active");

    $("#search-input").focus();

    templateInstance.state.set("searchCollection", searchCollection);
  }
});


/*
 * searchModal onDestroyed
 */
Template.searchModal.onDestroyed(() => {
  // Kill Allow modal to be closed by clicking ESC, which was initiated in Template.searchModal.onCreated
  $(document).off("keyup");
});
