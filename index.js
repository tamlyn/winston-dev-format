const chalk = require("chalk");
const { MESSAGE, LEVEL } = require("triple-beam");
const pretty = require("pretty-format");

const errorFormatter = {
  test: (val) => val instanceof Error,
  serialize: (error) => error.stack,
};
const stringFormatter = {
  test: (val) => typeof val === "string",
  serialize: (str) => JSON.stringify(str),
};

function DevFormat(config) {
  this.config = {
    padding: 20,
    ...config,
  };
}

DevFormat.prototype.transform = function (info) {
  let { message, level, ...rest } = info;

  if (typeof message === "object") {
    Object.assign(rest, message);
    message = "";
  }

  let formattedMessage = `${level}: ${message}`;
  const entries = Object.entries(rest);
  if (info instanceof Error) {
    entries.push(["error", info]);
  }
  for (let [key, value] of entries) {
    formattedMessage += `\n  ${this.formatKey(key)}${this.formatValue(value)}`;
  }

  info[LEVEL] = info[LEVEL] || level;
  info[MESSAGE] = formattedMessage;

  return info;
};

DevFormat.prototype.formatKey = function (key) {
  const escapedKey = JSON.stringify(key);
  const trimmedKey = escapedKey.substring(1, escapedKey.length - 1);
  const colorCodeWidth = chalk.level ? 10 : 0;
  return `${chalk.gray(trimmedKey)}: `.padEnd(
    this.config.padding + colorCodeWidth,
  );
};

DevFormat.prototype.formatValue = function (value) {
  return pretty(value, {
    highlight: true,
    min: true,
    plugins: [errorFormatter, stringFormatter],
  }).replace(/\n/g, "\n".padEnd(this.config.padding + 3));
};

module.exports = (config) => new DevFormat(config);
