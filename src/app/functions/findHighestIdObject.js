function findHighestIdObject(array) {
  if (!Array.isArray(array)) return array;
  if (array.length === 0) {
    return [];
  }

  // First, find the latest issue_date among all items
  const itemsWithIssueDate = array.filter((item) => item.issue_date);

  if (itemsWithIssueDate.length > 0) {
    // Find the latest issue_date
    const latestIssueTimestamp = itemsWithIssueDate.reduce((latest, item) => {
      const itemTimestamp = new Date(item.issue_date).getTime();
      return itemTimestamp > latest ? itemTimestamp : latest;
    }, new Date(itemsWithIssueDate[0].issue_date).getTime());

    // Get all items with the latest issue_date
    const itemsWithLatestIssueDate = itemsWithIssueDate.filter(
      (item) => new Date(item.issue_date).getTime() === latestIssueTimestamp
    );

    if (itemsWithLatestIssueDate.length === 1) {
      return itemsWithLatestIssueDate[0];
    } else {
      // Multiple items with the same latest issue_date
      // Sort them by expiry_date
      const itemsWithExpiryDate = itemsWithLatestIssueDate.filter(
        (item) => item.expiry_date
      );

      if (itemsWithExpiryDate.length > 0) {
        // Find the latest expiry_date among them
        const latestExpiryTimestamp = itemsWithExpiryDate.reduce(
          (latest, item) => {
            const itemTimestamp = new Date(item.expiry_date).getTime();
            return itemTimestamp > latest ? itemTimestamp : latest;
          },
          new Date(itemsWithExpiryDate[0].expiry_date).getTime()
        );

        // Get all items with the latest expiry_date
        const itemsWithLatestExpiryDate = itemsWithExpiryDate.filter(
          (item) =>
            new Date(item.expiry_date).getTime() === latestExpiryTimestamp
        );

        if (itemsWithLatestExpiryDate.length === 1) {
          return itemsWithLatestExpiryDate[0];
        } else {
          // Multiple items with same latest expiry_date
          // Return the one with highest id
          return itemsWithLatestExpiryDate.reduce(
            (max, item) => (item.id > max.id ? item : max),
            itemsWithLatestExpiryDate[0]
          );
        }
      } else {
        // If expiry_date is missing, sort by id
        return itemsWithLatestIssueDate.reduce(
          (max, item) => (item.id > max.id ? item : max),
          itemsWithLatestIssueDate[0]
        );
      }
    }
  } else {
    // If no items have issue_date, check for expiry_date
    const itemsWithExpiryDate = array.filter((item) => item.expiry_date);

    if (itemsWithExpiryDate.length > 0) {
      // Find the latest expiry_date
      const latestExpiryTimestamp = itemsWithExpiryDate.reduce(
        (latest, item) => {
          const itemTimestamp = new Date(item.expiry_date).getTime();
          return itemTimestamp > latest ? itemTimestamp : latest;
        },
        new Date(itemsWithExpiryDate[0].expiry_date).getTime()
      );

      // Get all items with the latest expiry_date
      const itemsWithLatestExpiryDate = itemsWithExpiryDate.filter(
        (item) => new Date(item.expiry_date).getTime() === latestExpiryTimestamp
      );

      if (itemsWithLatestExpiryDate.length === 1) {
        return itemsWithLatestExpiryDate[0];
      } else {
        // Multiple items with same latest expiry_date
        // Return the one with highest id
        return itemsWithLatestExpiryDate.reduce(
          (max, item) => (item.id > max.id ? item : max),
          itemsWithLatestExpiryDate[0]
        );
      }
    } else {
      // If no expiry_date, return item with highest id
      return array.reduce(
        (max, item) => (item.id > max.id ? item : max),
        array[0]
      );
    }
  }
}

export default findHighestIdObject;

// OLDER FUNCTION BELOW

// function findHighestIdObject(array) {
//   if (!Array.isArray(array)) return array;
//   if (array.length === 0) {
//     return [];
//   }
//   return array.reduce((max, item) => (item.id > max.id ? item : max), array[0]);
// }

// export default findHighestIdObject;
