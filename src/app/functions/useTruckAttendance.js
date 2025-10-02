import { useLoader } from "@/app/context/LoaderContext";

export function useTruckAttendance({
  onSuccessAssign,
  onSuccessStop,
  onError,
}) {
  const { startLoading, stopLoading } = useLoader();

  const assignTruckToDriver = async (params) => {
    startLoading();
    try {
      const data = new FormData();
      data.append("truck", params.chosen_truck);
      data.append("attendance", params.shift_id);
      data.append("truck_start_time", params.check_in_time);
      data.append("truck_end_time", params.check_out_time);

      const response = await fetch("/api/save-truck-attendance", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw response;
      }

      if (onSuccessAssign) onSuccessAssign(response);
      return response;
    } catch (error) {
      console.error("assignTruckToDriver error", error);
      if (onError) onError(error);
      throw error;
    } finally {
      stopLoading();
    }
  };

  const stopTruckShift = async (assignmentId, shiftId, checkoutTime) => {
    if (!assignmentId || !shiftId || !checkoutTime) {
      throw new Error("Missing one or more required parameters.");
    }

    startLoading();
    try {
      const data = new FormData();
      data.append("truck_end_time", checkoutTime);
      data.append("attendance", shiftId);

      const response = await fetch(
        `/api/save-truck-attendance/${assignmentId}`,
        {
          method: "PATCH",
          body: data,
        }
      );

      if (!response.ok) {
        throw response;
      }

      if (onSuccessStop) onSuccessStop(response);
      return response;
    } catch (error) {
      console.error("stopTruckShift error", error);
      if (onError) onError(error);
      throw error;
    } finally {
      stopLoading();
    }
  };

  return {
    assignTruckToDriver,
    stopTruckShift,
  };
}
