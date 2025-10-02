import { useState } from "react";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import Button from "../button/Button";
import { FUEL_REPORT_TYPES } from "@/app/assets/tableData";
import FileLoaderMultipleM from "../fileLoader/FileLoaderMultipleM";
import { useLoader } from "@/app/context/LoaderContext";

function FuelReportComponent({ closeModal, loadData }) {
  const [fuelReportType, setFuelReportType] = useState("");
  const [fuelReportFiles, setFuelReportFiles] = useState({});
  const [fileSent, setFileSent] = useState(false);

  const { startLoading, stopLoading } = useLoader();

  const uploadFiles = () => {
    startLoading();
    const data = new FormData();

    data.append("company", fuelReportType);

    fuelReportFiles.fuel_report.forEach((file) => {
      data.append("files", file);
    });

    fetch("/api/upload-fuel-report", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          setFileSent(true);
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("Error sending files:", error);
      })
      .finally(() => stopLoading());
  };

  const closeLoadFileModal = () => {
    setFileSent(false);
    closeModal();
    loadData();
  };

  return fileSent ? (
    <>
      <p>File sent successfully</p>
      <Button content={"OK"} style={"classicButton"} fn={closeLoadFileModal} />
    </>
  ) : (
    <>
      <p className="font-bold text-xl text-center">Upload Fuel Report CSV</p>
      <OptionsSelector
        value={fuelReportType}
        updateState={setFuelReportType}
        name={"Choose report type"}
        data={FUEL_REPORT_TYPES}
      />
      <FileLoaderMultipleM
        name={"fuel_report"}
        label={
          fuelReportType
            ? `Please upload a valid XLSX file for ${fuelReportType}.`
            : null
        }
        disabled={fuelReportType.length === 0}
        accept={".csv, .xls, .xlsx"}
        updateState={setFuelReportFiles}
        data={fuelReportFiles.fuel_report || []}
      />
      <div className="flex justify-between items-center">
        <Button content={"Close"} fn={closeModal} style={"classicButton"} />
        <Button
          content={"Load report"}
          style={"classicButton"}
          fn={uploadFiles}
          tooltipContent={
            Object.keys(fuelReportFiles).length === 0 && (
              <p>Please attach the file(s) first</p>
            )
          }
          tooltipId={"upload_fuel_report_files_tooltip"}
          highlighted={Object.keys(fuelReportFiles).length > 0}
          disabled={Object.keys(fuelReportFiles).length === 0}
        />
      </div>
    </>
  );
}

export default FuelReportComponent;
