const formatDuration = (ms) => {
  if (ms === 0) {
    return 0;
  }
  if (ms < 60000) {
    return `< 1min`;
  }
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const pad = (num) => num.toString().padStart(2, "0");
  return `${pad(hours)}h ${pad(minutes)}m`;
};

export default formatDuration;
