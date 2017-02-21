const welcome = new Tour({
  steps: [
    {
      element: "#welcome",
      title: "Welcome!",
      content: "Welcome to the Getting Started Tour! Click Next to start tour"
    },
    {
      element: "#product",
      title: "Products",
      content: "Click here to check out a product and add it to your shopping cart"
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
    },
    {
      element: "#add-to-cart",
      title: "Add to Cart",
      content: "Click here to add product to cart."
    },
    {
      element: "#product-images",
      title: "Product Images",
      content: "View product images here."
    }
  ]
});

// Initialize the tour
welcome.init();

// Start the tour
welcome.start();
