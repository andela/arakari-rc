var tour = new Tour({
  steps: [
  {
    element: "#one",
    title: "Title of my step",
    content: "Content of my step"
  },
  {
    element: "#two",
    title: "Title of my step",
    content: "Content of my step"
  }
]});

// Initialize the tour
tour.init();

// Start the tour
tour.start();