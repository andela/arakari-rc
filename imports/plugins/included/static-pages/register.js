import { Reaction } from "/server/api";
  
 Reaction.registerPackage({
   label: "Static Pages",
   name: "staticpages",
   icon: "fa fa-copy",
   autoEnable: true,
   settings: {
     name: "Static Pages"
   },
   registry: [{
     route: "/dashboard/static-pages",
     provides: "dashboard",
     workflow: "corePagesWorkFlow",
     name: "Static Pages",
     label: "Pages",
     description: "Create and manage static pages",
     icon: "fa fa-copy",
     priority: 1,
     container: "core",
     template: "staticPages"
   }],
   layout: [{
     layout: "coreLayout",
     workflow: "corePagesWorkFlow",
     theme: "default",
     enabled: true,
     structure: {
       template: "staticPages",
       layoutHeader: "layoutHeader",
       layoutFooter: "layoutFooter",
       notFound: "notFound",
       dashboardHeader: "dashboardHeader",
       dashboardControls: "dashboardControls",
       adminControlsFooter: "adminControlsFooter"
     }
   }]
 });
