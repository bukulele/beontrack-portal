function defineRoutes(routes) {
  let text = routes
    .map((route) => {
      switch (route) {
        case 1:
          return "CA HWY";
        case 2:
          return "USA";
        case 3:
          return "City";
        case 4:
          return "Regional";
        default:
          return "";
      }
    })
    .map((item, index) => {
      if (index !== routes.length - 1) {
        return item + ", ";
      } else {
        return item;
      }
    });
  return text;
}

export default defineRoutes;
