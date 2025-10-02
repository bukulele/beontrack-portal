import React, { createContext, useState, useEffect } from "react";

export const BaysWorksContext = createContext();

export const BaysWorksProvider = ({ children }) => {
  const [shopData, setShopData] = useState(null);
  const [mechanicsData, setMechanicsData] = useState(null);

  const loadMechanicsData = () => {
    fetch(`/api/get-mechanics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        let preparedData = {};

        for (let item of data) {
          preparedData[item.id] = { ...item };
        }
        setMechanicsData(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  };

  const loadData = () => {
    fetch(`/api/get-shop-jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setShopData(data);
        loadMechanicsData();
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BaysWorksContext.Provider value={{ shopData, mechanicsData }}>
      {children}
    </BaysWorksContext.Provider>
  );
};
