import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Reaction Analysis",
  name: "reaction-analysis",
  icon: "fa-pie-chart",
  autoEnable: true,
  settings: {
    name: "Reaction-Analysis"
  },
  registry: [{
    route: "/dashboard/reactionAnalysis",
    provides: "dashboard",
    workflow: "coreDashboardWorkflow",
    name: "reaction-analysis",
    label: "Reaction Analysis",
    description: "Statistical Analysis",
    icon: "fa-pie-chart",
    priority: 1,
    container: "core",
    template: "reactionAnalysis"
  }, {
    route: "/dashboard/reactionAnalysis",
    name: "reaction-analysis",
    provides: "shortcut",
    label: "Reaction Analysis",
    description: "Statistical Analysis",
    icon: "fa fa-pie-chart",
    priority: 1
  }]
});
