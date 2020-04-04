#!/usr/bin/env node

const fs = require("fs");
const { spawnSync } = require("child_process");

const readme = fs.readFileSync("./Readme.md", "utf8");
const code = readme
  // extract the code snippet
  .replace(/^.*```js(.*)```.*$/s, "$1")
  // make the stacktrace more screenshot-friendly
  .replace(/(new Error\([^)]+\))/, 'require("stacktrace-metadata")($1)')
  // require local module
  .replace("winston-dev-format", ".");
fs.writeFileSync(`./example.js`, code);

console.clear();
spawnSync("node", ["./example.js"], { stdio: "inherit" });
console.log();

setTimeout(() => {}, 5000);
