const tour = new Tour({
  storage: window.localStorage,
  steps: [
    {
      element: "#welcome",
      title: "Welcome!",
      content: "Welcome to the Getting Started Tour! Click Next to start tour"
    },
    {
      element: "#nav_search",
      title: "Search",
      content: "Click here to Search a product or store"
    },
    {
      element: "#lang",
      title: "Language",
      content: "Change the storefront language by clicking here and selecting language from the dropdown menu."
    },
    {
      element: "#acc",
      title: "Accounts",
      content: "Sign In and access your profile and account details by clicking here."
    },
    {
      element: "#shopping-cart",
      title: "Shopping Cart",
      content: "Access and checkout items in your shopping cart here."
    }
  ]
});

// Initialize the tour
tour.init();

// Start the tour
tour.start();

welcome = {
  start: function () {
    wel.restart();
  }
};
