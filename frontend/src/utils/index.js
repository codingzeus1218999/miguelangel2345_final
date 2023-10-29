export const commafy = (num) => {
  return num ? num.toLocaleString("en") : "0";
};

export const generateVerificationRandomCode = () => {
  return `[KICKBOT.GG:${Math.floor(Math.random() * 1000000)}${Math.floor(
    Math.random() * 1000000
  )}${Math.floor(Math.random() * 1000000)}]`;
};
