import ModalContainer from "../modalContainer/ModalContainer";
import Button from "../button/Button";
import NumericInput from "../numericInput/NumericInput";
import { useEffect, useState, useContext } from "react";
import { useLoader } from "@/app/context/LoaderContext";
import { DRIVER_RATES } from "@/app/assets/tableData";
import { DriverContext } from "@/app/context/DriverContext";
import { useSession } from "next-auth/react";

function UpdateRatesContainer({ keyName, value, modalIsOpen, setModalIsOpen }) {
  const [rates, setRates] = useState(DRIVER_RATES);
  const [ratesUpdated, setRatesUpdated] = useState(false);

  const { userData, loadData } = useContext(DriverContext);
  const { startLoading, stopLoading } = useLoader();
  const { data: session } = useSession();

  const handleContainerClose = () => {
    if (value.length === 0) {
      setRates(DRIVER_RATES);
    } else {
      setRates({ ...value });
    }
    setRatesUpdated(false);
    setModalIsOpen(false);
  };

  const saveRates = () => {
    startLoading();
    let data = { ...rates };
    let method = "POST";
    let apiRoute = "/api/add-rates";

    for (let key in data) {
      data[key] = Number(data[key]) > 0 ? Number(data[key]).toFixed(2) : "";
    }

    if (value.length !== 0) {
      data.endpointIdentifier = keyName;
      data.id = value.id;
      method = "PATCH";
      apiRoute = "/api/update-file";
    } else {
      data.driver = userData.id;
    }
    data.last_changed_by = session.user.name;

    fetch(apiRoute, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        stopLoading();
        if (response.ok) {
          loadData();
          setRatesUpdated(true);
        } else {
          console.error("Error submitting form");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  useEffect(() => {
    if (value.length === 0) return;

    for (let key in DRIVER_RATES) {
      setRates((prevData) => ({
        ...prevData,
        [key]: value[key],
      }));
    }
  }, [value]);

  return (
    <ModalContainer modalIsOpen={modalIsOpen}>
      {ratesUpdated ? (
        <>
          <p>Rates updated successfully</p>
          <Button
            content={"OK"}
            style={"classicButton"}
            fn={handleContainerClose}
          />
        </>
      ) : (
        <>
          <div className="text-slate-700 min-w-80 flex flex-col gap-1">
            <p className="text-center font-bold text-lg">Driver&apos;s rates</p>
            <NumericInput
              name={"ca_single"}
              label={"CA single"}
              value={rates.ca_single}
              updateState={setRates}
              allowDecimals={true}
            />
            <NumericInput
              name={"ca_team"}
              label={"CA team"}
              value={rates.ca_team}
              updateState={setRates}
              allowDecimals={true}
            />
            <NumericInput
              name={"us_team"}
              label={"US team"}
              value={rates.us_team}
              updateState={setRates}
              allowDecimals={true}
            />
            <NumericInput
              name={"city"}
              label={"City"}
              value={rates.city}
              updateState={setRates}
              allowDecimals={true}
            />
            <NumericInput
              name={"lcv_single"}
              label={"LCV single"}
              value={rates.lcv_single}
              updateState={setRates}
              allowDecimals={true}
            />
            <NumericInput
              name={"lcv_team"}
              label={"LCV team"}
              value={rates.lcv_team}
              updateState={setRates}
              allowDecimals={true}
            />
          </div>
          <div className="flex justify-between items-center">
            <Button
              content={"Close"}
              style={"classicButton"}
              fn={handleContainerClose}
            />
            <Button
              content={"Save"}
              style={"classicButton"}
              fn={saveRates}
              highlighted={true}
            />
          </div>
        </>
      )}
    </ModalContainer>
  );
}

export default UpdateRatesContainer;
