export const commafy = (num) => {
  return num ? num.toLocaleString("en") : "0";
};

export const generateVerificationRandomCode = () => {
  return `[KICKBOT.GG:${Math.floor(Math.random() * 1000000)}${Math.floor(
    Math.random() * 1000000
  )}${Math.floor(Math.random() * 1000000)}]`;
};

export const differenceTimes = (first, second) => {
  return (
    Math.abs(new Date(first).getTime() - new Date(second).getTime()) / 1000
  );
};
