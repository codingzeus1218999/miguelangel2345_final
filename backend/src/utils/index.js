import colors from "colors";

export const printMessage = (msg, state) => {
  switch (state) {
    case "success":
      console.log(msg.bgWhite.green);
      break;
    case "info":
      console.log(msg.bgWhite.blue);
      break;
    case "warning":
      console.log(msg.bgWhite.yellow);
      break;
    case "error":
      console.log(msg.bgYellow.red);
      break;
    default:
      console.log(msg);
      break;
  }
};
