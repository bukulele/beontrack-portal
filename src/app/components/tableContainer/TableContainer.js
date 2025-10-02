import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";
import copy from "copy-to-clipboard";
import Button from "../button/Button";
import downloadAsCsv from "@/app/tableData/downloadAsCsv";
import getValueByPath from "@/app/functions/getValueByPath";
import ModalContainer from "../modalContainer/ModalContainer";
import {
  EQUIPMENT_STATUS_CHOICES,
  REPORTS_TYPES,
  ROWS_PER_PAGE,
  STATUS_CHOICES,
  TABLE_STATUS_FILTERS,
  TRUCK_STATUS_CHOICES,
} from "@/app/assets/tableData";
import { usePagination } from "@table-library/react-table-library/pagination";
import Pagination from "../pagination/Pagination";
import useDebounce from "@/app/functions/useDebounce";
import { useLoader } from "@/app/context/LoaderContext";
import Link from "next/link";
import defineRoutes from "@/app/functions/defineRoutes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faArrowsRotate,
  faPlus,
  faSort,
  faSortUp,
  faSortDown,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import useUserRoles from "@/app/functions/useUserRoles";
import formatDate from "@/app/functions/formatDate";
import InfoCardModalContainer from "../modalContainer/InfoCardModalContainer";
import { RotatingLines } from "react-loader-spinner";
import generateSortFunctions from "@/app/functions/generateSortFunctions";
import checkDate from "@/app/functions/checkDate";
import { useInfoCard } from "@/app/context/InfoCardContext";
import TextInput from "../textInput/TextInput";
import defineRowsColor from "@/app/functions/defineRowsColor";
import CreateObjectModalContainer from "../modalContainer/CreateObjectModalContainer";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import FuelReportComponent from "../fuelReportComponent/FuelReportComponent";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import PayrollReportComponent from "../payrollReportComponent/PayrollReportComponent";

function TableContainer({
  tableTemplate,
  data,
  activeLinks,
  menuPointChosen,
  loadTableData,
  tableType,
  reportIsLoading,
  goToTable,
  goToTableLinks,
}) {
  const [search, setSearch] = useState("");
  const [showCopyDataWindow, setShowCopyDataWindow] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [filteredFields, setFilteredFields] = useState(null);
  const [numberOfRows, setNumberOfRows] = useState(30);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [uploadFuelReportModal, setUploadFuelReportModal] = useState(false);
  const [payrollReportModal, setPayrollReportModal] = useState(false);

  const { handleCardDataSet, setInfoCardModalIsOpen } = useInfoCard();
  const {
    setCreateObjectModalIsOpen,
    setObjectType,
    setAfterCreateCallback,
    handleCreateObjectModalClose,
  } = useCreateObject();

  const { stopLoading } = useLoader();

  const userRoles = useUserRoles();

  const debouncedSearch = useDebounce(search, 500);

  const timeoutRef = useRef(null);

  const defaultSortKeys = [
    "employee_id",
    "hiring_date",
    "incident_number",
    "violation_number",
  ];

  const THEME = {
    Table: `
      width: 100%;
      max-width: 100%;
      grid-template-columns: repeat(${
        tableTemplate.length - hiddenColumns.length
      }, minmax(auto, 300px));
      grid-auto-rows: min-content;
      color: grey;
      grid-column-start: 1;
      grid-column-end: 3;
      height: 100%;
      max-height: 100%;
    `,
    Header: ``,
    Body: ``,
    BaseRow: `
      background-color: #fff;
  
      &.row-select-selected, &.row-select-single-selected {
        color: #000;
      }
    `,
    HeaderRow: `
      font-size: 14px;
      color: #000;
  
      .th {
        border-bottom: 1px solid #000;
      }
    `,
    Row: `
      font-size: 12px;
      color: black;
  
      &:not(:last-of-type) .td {
        border-bottom: 1px solid gray;
      }
  
      &:hover {
        color: rgb(55, 65, 81);
      }
    `,
    BaseCell: `
      border-bottom: 1px solid transparent;
      border-right: 1px solid transparent;
  
      padding: 8px;
      height: auto;

      text-align: center;

      &:not(:last-of-type) {
          border-right: 1px dotted #a0a8ae;
      }
  
      svg {
        fill: gray;
      }
    `,
    HeaderCell: ``,
    Cell: ``,
  };

  const theme = useTheme(THEME);

  const defaultExcludedStatuses = ["TE", "RE", "RJ"]; // Define your excluded statuses here

  const tableData = {
    nodes: [...data].filter((item) => {
      const searchableFields = tableTemplate.filter(
        (field) => field.searchable
      );

      // If no fields are searchable, bypass the search filter
      if (searchableFields.length === 0) {
        return true;
      }

      const searchMatch = searchableFields.some((field) => {
        const fieldValue = getValueByPath(item, field.dataKey);
        return fieldValue
          ?.toString()
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      });

      const filterableField = tableTemplate.find(
        (field) => field.filterable
      )?.dataKey;

      // Apply status filter logic
      const statusValue = filterableField
        ? getValueByPath(item, filterableField)
        : null;

      const filterMatch = !statusFilter
        ? !defaultExcludedStatuses.includes(statusValue) // Exclude default statuses only when statusFilter is not set
        : statusValue?.includes(statusFilter);

      return searchMatch && filterMatch;
    }),
  };

  // Find the first available key in the table data
  const sortKey =
    defaultSortKeys.find((key) => tableData.nodes.some((row) => key in row)) ||
    defaultSortKeys[0]; // Fallback in case none exist

  const sortFunctions = generateSortFunctions(tableTemplate);

  const sort = useSort(
    tableData,
    {
      state: {
        sortKey,
        reverse: true,
      },
    },

    {
      sortIcon: {
        margin: "0px",
        iconDefault: (
          <FontAwesomeIcon className="text-neutral-500" icon={faSort} />
        ),
        iconUp: <FontAwesomeIcon className="text-red-700" icon={faSortUp} />,
        iconDown: (
          <FontAwesomeIcon className="text-red-700" icon={faSortDown} />
        ),
      },
      sortFns: sortFunctions,
    }
  );

  const pagination = usePagination(tableData.nodes, {
    state: {
      page: 0,
      size: numberOfRows,
    },
  });

  const createTableHeader = () => {
    let tableColumns = tableTemplate.map((item) => {
      if (item.sort) {
        return (
          <HeaderCellSort
            hide={hiddenColumns.includes(item.dataName)}
            sortKey={item.dataKey}
            key={`header_${item.dataName}`}
          >
            {item.dataName}
          </HeaderCellSort>
        );
      } else {
        return (
          <HeaderCell
            hide={hiddenColumns.includes(item.dataName)}
            key={`header_${item.dataName}`}
          >
            {item.dataName}
          </HeaderCell>
        );
      }
    });
    return tableColumns;
  };

  const handleCellClick = (data) => {
    clearTimeout(timeoutRef.current);
    setShowCopyDataWindow(true);
    copy(data);
    timeoutRef.current = setTimeout(() => {
      setShowCopyDataWindow(false);
    }, 3000);
  };

  const handleShowDriverCard = (infoCardId, infoCardTarget) => {
    handleCardDataSet(infoCardId, infoCardTarget);
    setInfoCardModalIsOpen(true);
  };

  const fillTableRow = (driver) => {
    let tableRowCells = tableTemplate.map((field, index) => {
      const cellData = field.dataKey.includes(".file")
        ? "File"
        : getValueByPath(driver, field.dataKey);
      let copyCell = field.copyable || false;

      let cellIsLink = field.isLink || false;
      let linkText = cellData;
      let linkHref = "";
      let infoCardLink = field.linkHandler === "showInfoCard";
      let infoCardId = driver[field.accessKey];
      // let infoCardId =
      //   field.linkHandlerTarget === tableType ? driver.id : driver.driver;
      let infoCardTarget = field.linkHandlerTarget
        ? field.linkHandlerTarget
        : "";
      let cellBackgroundColor = "";

      if (cellIsLink && field.linkField) {
        linkHref = getValueByPath(driver, field.linkField);
      }

      if (field.type === "enum") {
        linkText = field.values[cellData];
      }

      if (field.date) {
        linkText = formatDate(cellData);
      }

      if (field.routes) {
        linkText = defineRoutes(cellData);
      }

      if (
        cellIsLink &&
        linkText === "File" &&
        (linkHref === "" || linkHref === undefined)
      ) {
        linkText = "";
      }

      if (typeof linkText === "boolean") {
        linkText = linkText === true ? "Yes" : "No";
      }

      if (field.checkDate) {
        cellBackgroundColor = checkDate(cellData, 40);
      }

      return (
        <Cell
          hide={hiddenColumns.includes(field.dataName)}
          className={
            copyCell ? "cursor-copy" : infoCardLink ? "cursor-pointer" : ""
          }
          key={`cell_${driver.id}_${index}`}
          onClick={
            copyCell
              ? () => handleCellClick(driver[field.dataKey])
              : infoCardLink
              ? () => handleShowDriverCard(infoCardId, infoCardTarget)
              : null
          }
          style={{ backgroundColor: cellBackgroundColor }}
        >
          {cellIsLink && linkHref && activeLinks ? (
            <Link
              className="hover:text-sky-600 hover:underline"
              target={infoCardLink ? "" : "_blank"}
              href={linkHref}
            >
              {linkText}
            </Link>
          ) : (
            linkText
          )}
        </Cell>
      );
    });
    return tableRowCells;
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleDownloadCsv = () => {
    const columns = tableTemplate.map((field) => ({
      accessor: (item) => item[field.dataKey],
      name: field.dataName,
    }));

    let tableDataToDownload = tableData.nodes.map((driver) => {
      let newDriver = {};
      tableTemplate.forEach((field) => {
        let cellData = getValueByPath(driver, field.dataKey);
        let cellIsLink = field.isLink || false;

        if (cellIsLink && field.linkField) {
          cellData = getValueByPath(driver, field.dataKey);
        }

        if (field.type === "enum") {
          cellData = field.values[cellData];
        }

        if (field.date) {
          cellData = formatDate(cellData);
        }

        if (field.routes) {
          cellData = defineRoutes(cellData);
        }

        if (typeof cellData === "boolean") {
          cellData = cellData === true ? "Yes" : "No";
        }

        newDriver[field.dataKey] = cellData;
      });
      return newDriver;
    });

    downloadAsCsv(columns, tableDataToDownload, "table");
  };

  const toggleColumn = (column) => {
    if (hiddenColumns.includes(column)) {
      setHiddenColumns(hiddenColumns.filter((v) => v !== column));
    } else {
      setHiddenColumns(hiddenColumns.concat(column));
    }
  };

  const toggleColumnsSelection = () => {
    if (hiddenColumns.length > 0) {
      setHiddenColumns([]);
    } else {
      let hideAllColumns = tableTemplate.map((item) => item.dataName);
      setHiddenColumns(hideAllColumns);
    }
  };

  const handleStatusFilterChange = (status) => {
    if (status === statusFilter) {
      setStatusFilter("");
    } else {
      setStatusFilter(status);
    }
  };

  const afterObjectCreateCallback = () => {
    handleCreateObjectModalClose();
    loadTableData();
  };

  const handleOpenCreateModal = () => {
    setAfterCreateCallback(() => afterObjectCreateCallback);
    setObjectType(tableType);
    setCreateObjectModalIsOpen(true);
  };

  useEffect(() => {
    let columnsToHide = tableTemplate
      .map((item) => {
        if (!item.show) {
          return item.dataName;
        }
      })
      .filter((item) => item);
    setHiddenColumns(columnsToHide);
  }, [tableTemplate]);

  useEffect(() => {
    if (!filteredFields) return;

    stopLoading();
  }, [filteredFields]);

  useEffect(() => {
    let list = tableTemplate.map((item) => {
      return (
        <div key={`columns_hide_key_${item.dataKey}`} className="space-x-1">
          <input
            id={`columns_hide_${item.dataKey}`}
            type="checkbox"
            value="NAME"
            checked={!hiddenColumns.includes(item.dataName)}
            onChange={() => toggleColumn(item.dataName)}
            className="rounded"
          />
          <label htmlFor={`columns_hide_${item.dataKey}`}>
            {item.dataName}
          </label>
        </div>
      );
    });
    setFilteredFields(list);
  }, [hiddenColumns]);

  useEffect(() => {
    setNumberOfPages(Math.floor(tableData.nodes.length / numberOfRows));
  }, [numberOfRows, tableData.nodes.length]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-full max-h-full px-1 relative grid grid-cols-[min-content_1fr] grid-rows-[1fr_13fr]">
      <div className="flex gap-2 items-start">
        {tableTemplate.filter((item) => item.searchable).length > 0 && (
          <div className="flex flex-col gap-1 py-2">
            <div className="text-slate-700 flex flex-col gap-1">
              <p className="text-xs font-bold">Search:</p>
              <TextInput
                name={"search"}
                value={search}
                updateState={setSearch}
                style={"small"}
              />
            </div>
            <p className="text-xs text-gray-500">
              {`Search by ${tableTemplate
                .filter((item) => item.searchable)
                .map((item) => item.dataName)
                .join(", ")}`}
            </p>
          </div>
        )}
        {TABLE_STATUS_FILTERS[menuPointChosen] && (
          <div className="flex flex-col gap-1 text-slate-700 pt-2 pl-5">
            <p className="text-xs font-bold">Status filter:</p>
            <div className="flex gap-3 items-center">
              {TABLE_STATUS_FILTERS[menuPointChosen].map((status, index) => {
                let tooltipContent = "";

                if (tableType === "driver" || tableType === "employee") {
                  tooltipContent = STATUS_CHOICES[status];
                } else if (tableType === "truck") {
                  tooltipContent = TRUCK_STATUS_CHOICES[status];
                } else if (tableType === "equipment") {
                  tooltipContent = EQUIPMENT_STATUS_CHOICES[status];
                } else if (tableType === "driver_reports") {
                  tooltipContent = REPORTS_TYPES[status];
                }

                return (
                  <Button
                    key={`${status}_${index}`}
                    style="classicButton-s"
                    fn={() => handleStatusFilterChange(status)}
                    content={status}
                    highlighted={statusFilter === status}
                    tooltipContent={tooltipContent}
                    tooltipId={`status_filter_${status}`}
                  />
                );
              })}
            </div>
            {(tableType === "driver" || tableType === "employee") &&
              defaultExcludedStatuses.length > 0 && (
                <p className="text-xs text-gray-500">{`${defaultExcludedStatuses.join(
                  ", "
                )} are filtered out by default`}</p>
              )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 items-end justify-end py-2">
        <div className="flex gap-2 items-center justify-end py-2">
          {goToTableLinks.map((links) => {
            return (
              <Button
                key={`go_to_report_${links.type}`}
                content={links.name}
                fn={() => goToTable(links.type)}
                style={"classicButton"}
              />
            );
          })}
          {tableType === "employee" &&
            menuPointChosen === "office-employees" &&
            (userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
              )) && (
              <Button
                content={<FontAwesomeIcon icon={faCalendarCheck} />}
                fn={() => setPayrollReportModal(true)}
                style="classicButton"
                tooltipContent={"Payroll Report"}
                tooltipId={"employees_payroll_report_tooltip"}
              />
            )}
          {reportIsLoading ? (
            <RotatingLines
              visible={true}
              height="20"
              width="20"
              strokeColor="orange"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          ) : (
            <Button
              content={<FontAwesomeIcon icon={faArrowsRotate} />}
              fn={loadTableData}
              style={"classicButton"}
              tooltipContent={"Refresh table data"}
              tooltipId={"table_data_refresh_tooltip"}
            />
          )}
          {((tableType === "driver" &&
            menuPointChosen === "recruiting" &&
            (userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
              ))) ||
            tableType === "truck" ||
            tableType === "equipment" ||
            tableType === "incident" ||
            tableType === "violation" ||
            tableType === "employee" ||
            tableType === "wcb") && (
            <Button
              content={<FontAwesomeIcon icon={faPlus} />}
              fn={handleOpenCreateModal}
              style={"classicButton"}
              tooltipContent={`Create ${tableType}`}
              tooltipId={`create_${tableType}_tooltip`}
            />
          )}
          {tableType === "fuel-report" && (
            <Button
              content={<FontAwesomeIcon icon={faFileUpload} />}
              fn={() => setUploadFuelReportModal(true)}
              style={"classicButton"}
              tooltipContent={`Upload fuel report`}
              tooltipId={`upload_fuel_report_tooltip`}
            />
          )}
          <Button
            content={"Choose columns"}
            fn={openModal}
            style={"classicButton"}
          />
          {!userRoles.includes(
            process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER
          ) &&
            !userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_DISPATCH
            ) &&
            !userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP
            ) && (
              <Button
                content={"Download as CSV"}
                fn={handleDownloadCsv}
                style={"classicButton"}
              />
            )}
          <Button
            content={
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </div>
            }
            fn={() => signOut({ redirect: false })}
            style={"classicButton"}
            tooltipContent={"Sign Out"}
            tooltipId={"signOutButton-tooltip"}
          />
        </div>
        <Pagination
          firstPage={() => pagination.fns.onSetPage(0)}
          prevPage={() => pagination.fns.onSetPage(pagination.state.page - 1)}
          nextPage={() => pagination.fns.onSetPage(pagination.state.page + 1)}
          lastPage={() => pagination.fns.onSetPage(numberOfPages)}
          showFrom={pagination.state.page * numberOfRows + 1}
          showTo={Math.min(
            (pagination.state.page + 1) * numberOfRows,
            tableData.nodes.length
          )}
          totalItems={tableData.nodes.length}
          itemsPerPageOptions={ROWS_PER_PAGE}
          numberOfRows={numberOfRows}
          setNumberOfRows={setNumberOfRows}
          currentPage={pagination.state.page}
          numberOfPages={numberOfPages}
        />
      </div>
      <Table
        pagination={pagination}
        data={tableData}
        theme={theme}
        sort={sort}
        layout={{
          horizontalScroll: true,
          fixedHeader: true,
        }}
      >
        {(tableList) => {
          return (
            <>
              <Header>
                <HeaderRow>{createTableHeader()}</HeaderRow>
              </Header>
              <Body>
                {tableList.map((item, index) => (
                  <Row
                    className={defineRowsColor(item.status)}
                    key={`${item.id}_${index}`}
                    item={item}
                  >
                    {fillTableRow(item)}
                  </Row>
                ))}
              </Body>
            </>
          );
        }}
      </Table>
      {showCopyDataWindow && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
          }}
        >
          Data copied to clipboard
        </div>
      )}
      <ModalContainer modalIsOpen={modalIsOpen}>
        <h2>Choose columns to show</h2>
        <div className="overflow-y-scroll p-1">{filteredFields}</div>
        <div className="flex justify-between">
          <Button content={"Close"} style={"classicButton"} fn={closeModal} />
          <Button
            content={hiddenColumns.length > 0 ? "Select all" : "Deselect all"}
            style={"classicButton"}
            fn={toggleColumnsSelection}
          />
        </div>
      </ModalContainer>
      <ModalContainer modalIsOpen={uploadFuelReportModal}>
        <FuelReportComponent
          loadData={loadTableData}
          closeModal={() => setUploadFuelReportModal(false)}
        />
      </ModalContainer>
      <ModalContainer
        modalIsOpen={payrollReportModal}
        setModalClose={() => setPayrollReportModal(false)}
      >
        <PayrollReportComponent />
      </ModalContainer>
      <InfoCardModalContainer />
      <CreateObjectModalContainer />
    </div>
  );
}

export default TableContainer;
