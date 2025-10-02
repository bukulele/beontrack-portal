export const MAIN_DASHBOARD_TEMPLATE = {
  total_ac_tr_drivers: {
    key: "total_ac_tr_drivers",
    name: "Total Active Drivers",
  },
  usa_route_drivers: {
    key: "usa_route_drivers",
    name: "USA Drivers",
  },
  city_route_drivers: {
    key: "city_route_drivers",
    name: "CITY Drivers",
  },
  wcb_drivers: {
    key: "wcb_drivers",
    name: "WCB Drivers",
  },
  lcv_certified_drivers: {
    key: "lcv_certified_drivers",
    name: "LCV Certified Drivers",
  },
  cp_drivers: {
    key: "cp_drivers",
    name: "CP Drivers",
  },
  ca_hwy_route_drivers: {
    key: "ca_hwy_route_drivers",
    name: "HWY Drivers",
  },
  drivers_by_province: {
    key: "drivers_by_province",
    name: "Drivers By Province",
    multiple: true,
    subKeys: [
      {
        key: "mb_drivers",
        name: "Manitoba",
      },
      {
        key: "on_drivers",
        name: "Ontario",
      },
      {
        key: "sk_drivers",
        name: "Saskatchewan",
      },
    ],
  },
  drivers_by_type: {
    key: "drivers_by_type",
    name: "Drivers By Type",
    multiple: true,
    subKeys: [
      {
        key: "company_drivers",
        name: "Company Drivers",
      },
      {
        key: "oo_drivers",
        name: "Owner Operators",
      },
      {
        key: "od_drivers",
        name: "Owner Operator Drivers",
      },
    ],
  },
  // lmia_drivers: {
  //   key: "lmia_drivers",
  //   name: "LMIA Drivers",
  // },
  driver_to_be_reviewed: {
    key: "driver_to_be_reviewed",
    name: "Drivers To Be Reviewed By Safety",
    menuClick: "drivers_to_be_reviewed",
  },
  expiring_drivers: {
    key: "expiring_drivers",
    name: "Drivers With Expiring Documents",
    menuClick: "expiring-driver-docs",
  },
};
