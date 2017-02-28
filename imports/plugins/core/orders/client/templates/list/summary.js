import { Template } from "meteor/templating";
import { NumericInput } from "/imports/plugins/core/ui/client/components";

Template.ordersListSummary.onCreated(function () {
  this.state = new ReactiveDict();

  this.autorun(() => {
    const currentData = Template.currentData();
    const order = currentData.order;
    this.state.set("order", order);
  });
});

/**
 * ordersListSummary helpers
 *
 * @returns paymentInvoice
 */
Template.ordersListSummary.helpers({
  invoice() {
    return this.invoice;
  },

  numericInputProps(value) {
    const { currencyFormat } = Template.instance().data;

    return {
      component: NumericInput,
      value,
      format: currencyFormat,
      isEditing: false
    };
  },

  displayCancelButton() {
    return !(this.order.workflow.status === "canceled"
     || this.order.workflow.status === "coreOrderWorkflow/canceled");
  },

  orderStatus() {
    if (this.order.workflow.status === "canceled") {
      return true;
    }
    return false;
  }
});

/**
 * ordersListSummary events
 */
Template.ordersListSummary.events({
  /**
  * Submit form
  * @param  {Event} event - Event object
 * @param  {Template} instance - Blaze Template
* @return {void}
*/
  "click button[name=cancel]"(event, instance) {
    event.stopPropagation();

    const state = instance.state;
    const order = state.get("order");

    swal({
      title: "Are you sure?",
      text: "You want to cancel the order placed!",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: ".btn-danger",
      confirmButtonText: "Yes!"
    })
    .then(() => {
      Meteor.call("orders/cancelOrder", order, (error) => {
        if (error) {
          swal("Order cancellation unsuccesful.", "success");
        }
      });
    });
  }
});

