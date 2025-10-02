import { DriverContext } from "@/app/context/DriverContext";
import { useContext, useEffect, useState } from "react";
import { WEEK_DAYS } from "@/app/assets/tableData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck, faSquare } from "@fortawesome/free-solid-svg-icons";
import Button from "../button/Button";
import { useLoader } from "@/app/context/LoaderContext";
import SwitchableComponent from "../switchableComponent/SwitchableComponent";
import { Box, Tooltip } from "@mui/material";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

function DriverScheduleComponent({ closeScheduleModal }) {
  const [schedule, setSchedule] = useState("");
  const [nightDriver, setNightDriver] = useState(false);

  const { userData, loadData } = useContext(DriverContext);
  const { startLoading, stopLoading } = useLoader();
  // Using local state so clicks can toggle schedule.

  const toggleSchedule = (day) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: !prevSchedule[day],
    }));
  };

  // Function to save the schedule object to the server.
  const saveSchedule = async () => {
    startLoading();

    // Build the API URL and HTTP method based on schedule.id.
    let url = "/api/get-driver-schedule";
    let method = "POST";
    if (schedule.id) {
      url = `/api/get-driver-schedule/${schedule.id}`;
      method = "PATCH";
    }

    const scheduleData = { driver: userData.id, ...schedule };

    try {
      // First request: Save schedule
      const response1 = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });

      // Second request: Update night_driver
      const formData = new FormData();
      formData.append("night_driver", nightDriver);

      const response2 = await fetch(`/api/upload-driver-data/${userData.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response1.ok && response2.ok) {
        loadData();
        closeScheduleModal();
      } else {
        console.error(
          "Failed to save one or both parts of the schedule update"
        );
      }
    } catch (error) {
      console.error("Error saving schedule or night_driver data:", error);
    } finally {
      stopLoading();
    }
  };

  // If there's no schedule, create a default object with all days set to false.
  useEffect(() => {
    if (!userData) return;

    if (!userData.schedule || userData.schedule === "") {
      const defaultSchedule = {};
      Object.keys(WEEK_DAYS).forEach((day) => {
        defaultSchedule[day] = false;
      });
      setSchedule(defaultSchedule);
    } else {
      setSchedule(userData.schedule);
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    setNightDriver(userData.night_driver);
  }, [userData]);

  if (!userData) return;

  return (
    <div className="w-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-center">
        {`${userData.driver_id} ${userData.first_name} ${userData.last_name} work schedule`}
      </h3>
      <div className="flex w-full">
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 0.5,
          }}
        >
          <Tooltip title="Day shift drivers">
            <WbSunnyIcon fontSize="small" sx={{ color: "#fc8903" }} />
          </Tooltip>
          <SwitchableComponent
            checked={nightDriver}
            onCheckedChange={() => setNightDriver((value) => !value)}
          />
          <Tooltip title="Night shift drivers">
            <BedtimeIcon fontSize="small" sx={{ color: "#6649ff" }} />
          </Tooltip>
        </Box>
      </div>
      <table className="w-full text-center border-collapse">
        <thead>
          <tr>
            {Object.keys(WEEK_DAYS).map((day, index) => (
              <th
                key={`${userData.id}-${day}-${index}`}
                className="py-2 border px-4"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(WEEK_DAYS).map((day, index) => (
              <td
                key={`${userData.id}-icon-${day}-${index}`}
                className="py-2 border px-4 cursor-pointer"
                onClick={() => toggleSchedule(day)}
              >
                <FontAwesomeIcon
                  icon={schedule[day] ? faSquareCheck : faSquare}
                  color={schedule[day] ? "#22c55e" : "#f87171"}
                  className="text-xl"
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="flex gap-3 mt-3 w-full justify-between">
        <Button
          content={"Close"}
          style={"classicButton"}
          fn={closeScheduleModal}
        />
        <Button
          content={"Save"}
          style={"classicButton"}
          fn={saveSchedule}
          highlighted={true}
        />
      </div>
    </div>
  );
}

export default DriverScheduleComponent;
