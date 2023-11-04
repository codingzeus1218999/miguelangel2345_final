const colors = require("colors");

const printMessage = (msg, state = "info") => {
  switch (state) {
    case "success":
      console.log(`${msg}`.bgWhite.green);
      break;
    case "info":
      console.log(`${msg}`.bgWhite.blue);
      break;
    case "warning":
      console.log(`${msg}`.bgWhite.yellow);
      break;
    case "error":
      console.log(`${msg}`.bgYellow.red);
      break;
    default:
      console.log(`${msg}`);
      break;
  }
};

const makeRegex = (str) => {
  const regexStr = str
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/%\w+%/g, (match) => {
      if (match === "%USERS%") {
        return "([\\w,\\s]+)";
      } else if (match === "%POINTS%") {
        return "(\\d+)";
      } else {
        return match;
      }
    })
    .replace(/\s+/g, "\\s+");
  return new RegExp(`^${regexStr}$`);
};

module.exports = {
  printMessage,
  makeRegex,
};
