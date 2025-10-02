import React from "react";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

const Pagination = ({
  firstPage,
  prevPage,
  nextPage,
  lastPage,
  showFrom,
  showTo,
  totalItems,
  itemsPerPageOptions,
  numberOfRows,
  setNumberOfRows,
  currentPage,
  numberOfPages,
}) => {
  return (
    <div className="flex items-center justify-between gap-1">
      <span>
        {showFrom} - {showTo} of {totalItems}
      </span>
      <Button
        content={<FontAwesomeIcon icon={faAnglesLeft} className="text-xs" />}
        fn={firstPage}
        style={"classicButton-s"}
        disabled={currentPage === 0}
      />
      <Button
        content={<FontAwesomeIcon icon={faAngleLeft} className="text-xs" />}
        fn={prevPage}
        style={"classicButton-s"}
        disabled={currentPage === 0}
      />
      <Button
        content={<FontAwesomeIcon icon={faAngleRight} className="text-xs" />}
        fn={nextPage}
        style={"classicButton-s"}
        disabled={currentPage === numberOfPages}
      />
      <Button
        content={<FontAwesomeIcon icon={faAnglesRight} className="text-xs" />}
        fn={lastPage}
        style={"classicButton-s"}
        disabled={currentPage === numberOfPages}
      />
      <OptionsSelector
        data={itemsPerPageOptions}
        value={numberOfRows}
        updateState={setNumberOfRows}
        name={"rows_per_page"}
        label={""}
        style="small"
      />
    </div>
  );
};

export default Pagination;
