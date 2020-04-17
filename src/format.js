const { MESSAGE } = require("triple-beam");
let { format, formatWithOptions } = require("util");

if (!formatWithOptions) {
  formatWithOptions = (options, ...args) => format(...args);
}

function DevFormat() {}

const padKeys = 18;

DevFormat.prototype.transform = function (info) {
  let { level, message, ...rest } = info;
  if (typeof message !== "string") {
    rest = message;
    message = "";
  }

  info[MESSAGE] = `${level}: ${message}`;
  for (let [key, value] of Object.entries(rest)) {
    const escapedKey = key.match(/^\w+$/)
      ? key
      : formatWithOptions({ colors: false }, "%O", key);
    const formattedKey = `  ${escapedKey}: `.padEnd(padKeys);
    const formattedValue = formatWithOptions({ colors: true }, "%O", value)
      .split("\n")
      .join("\n".padEnd(padKeys + 1));
    info[MESSAGE] += `\n${formattedKey}${formattedValue}`;
  }
  return info;
};

module.exports = () => new DevFormat();
