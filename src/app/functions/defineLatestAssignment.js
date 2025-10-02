const defineLatestAssignment = (assignments) => {
  if (!assignments || assignments.length === 0) {
    console.error("No truck assignments found");
    return;
  }

  // Only consider assignments where truck_end_time is null
  const ongoingAssignments = assignments.filter(
    (assignment) => assignment.truck_end_time === null
  );
  if (ongoingAssignments.length === 0) {
    console.error("No ongoing truck assignments found");
    return;
  }
  // Find the latest ongoing assignment based on truck_start_time
  const latestAssignment = ongoingAssignments.reduce((prev, curr) =>
    new Date(curr.truck_start_time) > new Date(prev.truck_start_time)
      ? curr
      : prev
  );

  return latestAssignment;
};

export default defineLatestAssignment;
