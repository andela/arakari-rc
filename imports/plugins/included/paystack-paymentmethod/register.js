import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Paystack",
  name: "reaction-paystack",
  icon: "fa fa-money",
  autoEnable: false,
  registry: [{
    provides: "dashboard",
    label: "Paystack",
    description: "Paystack payments",
    icon: "fa fa-money",
    priority: 3,
    container: "paymentMethod",
    permissions: [{
      label: "Paystack",
      permission: "dashboard/payments"
    }]
  }, {
    label: "Paystack Settings",
    route: "/dashboard/paystack",
    provides: "settings",
    container: "reaction-paystack",
    template: "paystackSettings"
  }, {
    route: "/paystack/done",
    name: "paystackDone",
    template: "paystackDone",
    workflow: "coreWorkflow"
  }, {
    route: "/paystack/cancel",
    name: "paystackCancel",
    template: "paystackCancel",
    workflow: "coreWorkflow"
  }, {
    template: "paystackPaymentForm",
    provides: "paymentMethod"
  }]
});
