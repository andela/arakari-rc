import Drop from "tether-drop";
import { Meteor } from "meteor/meteor";
import { Blaze } from "meteor/blaze";
import { Template } from "meteor/templating";
import { Reaction, i18next } from "/client/api";
import { Packages } from "/lib/collections";
import { Tags } from "/lib/collections";


Template.coreAdminLayout.onRendered(function () {
  $("body").addClass("admin");
});

Template.coreAdminLayout.onDestroyed(() => {
  $("body").removeClass("admin");
});

Template.coreAdminLayout.helpers({
  shortcutButtons() {
    const instance = Template.instance();
    const shortcuts = Reaction.Apps({
      provides: "shortcut",
      enabled: true,
      container: undefined
    });

    const items = [];

    if (_.isArray(shortcuts)) {
      for (const shortcut of shortcuts) {
        items.push({
          type: "link",
          href: Reaction.Router.pathFor(shortcut.name),
          className: Reaction.Router.isActiveClassName(shortcut.name),
          icon: shortcut.icon,
          tooltip: shortcut.label || "",
          i18nKeyTooltip: shortcut.i18nKeyLabel,
          tooltipPosition: "left middle"
        });
      }
    }

    items.push({
      type: "seperator"
    });

    items.push({
      icon: "plus",
      tooltip: "Add Product",
      i18nKeyTooltip: "app.createContent",
      tooltipPosition: "left middle",
      onClick() {
        Meteor.call("products/createProduct", (error, productId) => {
          if (Meteor.isClient) {
            let currentTag;
            let currentTagId;

            if (error) {
              throw new Meteor.Error("createProduct error", error);
            } else if (productId) {
              currentTagId = Session.get("currentTag");
              currentTag = Tags.findOne(currentTagId);
              if (currentTag) {
                Meteor.call("products/updateProductTags", productId, currentTag.name, currentTagId);
              }
              // go to new product
              Reaction.Router.go("product", {
                handle: productId
              });
            }
          }
        });
      }
    });

    return items;
  },

  isSeperator(props) {
    if (props.type === "seperator") {
      return true;
    }
    return false;
  },

  packageButtons() {
    const routeName = Reaction.Router.getRouteName();

    if (routeName !== "dashboard") {
      const registryItems = Reaction.Apps({provides: "settings", container: routeName});
      const buttons = [];

      for (const item of registryItems) {
        if (Reaction.hasPermission(item.route, Meteor.userId())) {
          let icon = item.icon;

          if (!item.icon && item.provides === "settings") {
            icon = "gear";
          }

          buttons.push({
            href: item.route,
            icon: icon,
            tooltip: i18next.t(item.i18nKeyLabel, item.i18n),
            tooltipPosition: "left middle",
            onClick() {
              Reaction.showActionView(item);
            }
          });
        }
      }

      return buttons;
    }
    return [];
  },

  control: function () {
    return Reaction.getActionView();
  },

  adminControlsClassname: function () {
    if (Reaction.isActionViewOpen()) {
      return "show-settings";
    }
    return "";
  },

  /**
   * thisApp
   * @return {Object} Registry entry for item
   */
  thisApp() {
    const reactionApp = Packages.findOne({
      "registry.provides": "settings",
      "registry.route": Reaction.Router.getRouteName()
    }, {
      enabled: 1,
      registry: 1,
      name: 1,
      route: 1
    });

    if (reactionApp) {
      const settingsData = _.find(reactionApp.registry, function (item) {
        return item.route === Reaction.Router.getRouteName() && item.provides === "settings";
      });

      return settingsData;
    }
    return reactionApp;
  }
});

// Template.coreAdminLayout.events({
//   /**
//    * Submit sign up form
//    * @param  {Event} event - jQuery Event
//    * @param  {Template} template - Blaze Template
//    * @return {void}
//    */
//   "click .admin-controls-quicklinks a, click .admin-controls-quicklinks button"(event) {
//     if (this.name === "createProduct") {
//       event.preventDefault();
//       event.stopPropagation();
//
//       if (!this.dropInstance) {
//         this.dropInstance = new Drop({
//           target: event.target,
//           content: "",
//           constrainToWindow: true,
//           classes: "drop-theme-arrows",
//           position: "right center"
//         });
//
//         Blaze.renderWithData(Template.createContentMenu, {}, this.dropInstance.content);
//       }
//
//       this.dropInstance.open();
//     } else if (this.route) {
//       event.preventDefault();
//       event.stopPropagation();
//
//       Reaction.Router.go(this.name);
//     }
//   }
// });
