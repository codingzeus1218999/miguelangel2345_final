const formatTimeToHMS = (seconds) => {
  let mark = seconds < 0 ? "-" : "";
  let h = Math.abs(parseInt(seconds / 3600));
  let m = Math.abs(parseInt((seconds % 3600) / 60));
  let s = Math.abs(parseInt(seconds % 60));
  return `${mark}${formatNumberToTime(h)}:${formatNumberToTime(
    m
  )}:${formatNumberToTime(s)}`;
};

const formatNumberToTime = (num) => {
  return num > 9 ? num : `0${num}`;
};
