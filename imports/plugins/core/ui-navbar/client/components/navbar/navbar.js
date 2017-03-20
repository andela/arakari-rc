import { Meteor } from "meteor/meteor";
import { FlatButton } from "/imports/plugins/core/ui/client/components";
import { Reaction } from "/client/api";
import { Tags } from "/lib/collections";
import { Template } from "meteor/templating";
import { Notifications } from "/lib/collections";
import * as Collections from "/lib/collections";

Template.CoreNavigationBar.onCreated(function () {
  this.state = new ReactiveDict();
});

/**
 * layoutHeader events
 */
Template.CoreNavigationBar.events({
  "click .navbar-accounts .dropdown-toggle": function () {
    return setTimeout(function () {
      return $("#login-email").focus();
    }, 100);
  },
  "click .header-tag, click .navbar-brand": function () {
    return $(".dashboard-navbar-packages ul li").removeClass("active");
  },
  "click .search": function () {
    Blaze.renderWithData(Template.searchModal, {
    }, $("body").get(0));
    $("body").css("overflow", "hidden");
    $("#search-input").focus();
  }
});

Template.CoreNavigationBar.helpers({
  IconButtonComponent() {
    return {
      component: FlatButton,
      icon: "fa fa-search",
      kind: "flat"
      // onClick() {
      //   Blaze.renderWithData(Template.searchModal, {
      //   }, $("body").get(0));
      //   $("body").css("overflow-y", "hidden");
      //   $("#search-input").focus();
      // }
    };
  },
  onMenuButtonClick() {
    const instance = Template.instance();
    return () => {
      if (instance.toggleMenuCallback) {
        instance.toggleMenuCallback();
      }
    };
  },

  tagNavProps() {
    const instance = Template.instance();
    let tags = [];

    tags = Tags.find({
      isTopLevel: true
    }, {
      sort: {
        position: 1
      }
    }).fetch();

    return {
      name: "coreHeaderNavigation",
      editable: Reaction.hasAdminAccess(),
      isEditing: true,
      tags: tags,
      onToggleMenu(callback) {
        // Register the callback
        instance.toggleMenuCallback = callback;
      }
    };
  }
});

Template.notifMsg.onCreated(function () {
  this.notifications = ReactiveVar();
  this.autorun(() => {
    const instance = this;
    Meteor.call("notifications/retrieveNotifications", Meteor.userId(), (err, res) => {
      instance.notifications.set(res);
    });
  });
});

Template.notifList.onCreated(function () {
  this.notifications = ReactiveVar();
  this.autorun(() => {
    const instance = this;
    Meteor.call("notification/getUnreadCount", (err, res) => {
      instance.notifications.set(res);
    });
  });
});

Template.notifMsg.events({
  /**
   * Clear Notifications
   * @param  {Event} event - jQuery Event
   * @return {void}
   */
  "click #clearNotifications": (event) => {
    event.preventDefault();
    Meteor.call("notifications/clearNotifications", Meteor.userId());
    Meteor._reload.reload();
  }
});

Template.notifList.helpers({
  notifIcon() {
    return "fa fa-envelope-o";
  },
  notifCount() {
    return Template.instance().notifications.get();
  },
  findNotification() {
    return (Template.instance().notifications.get() > 0);
  }
});

Template.notifMsg.helpers({
  displayNotification() {
    return Template.instance().notifications.get();
  }
});

Template.notifList.events({
  "click #clearReadCount": () => {
    Meteor.call("notifications/markReadAll");
  }
});
