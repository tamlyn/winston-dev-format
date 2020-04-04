# Winston Dev Format

## What

Pretty log output for local development.

![Logger terminal output](https://github.com/tamlyn/winston-dev-format/blob/master/screenshot.png)

## Why

In production you should probably be logging JSON as it makes it easier
to log complex objects and filter and search them later. But JSON is hard to read.

Make your life easier during development by logging in a format that's easier to read.

## How

```js
const { createLogger, format, transports } = require("winston");
const devFormat = require("winston-dev-format");

// set up the logger however you like
const isProduction = process.env.NODE_ENV === "production";
const logger = createLogger({
  format: isProduction
    ? format.json()
    : format.combine(format.colorize(), devFormat()), // <-- here
  transports: [new transports.Console()],
});

// get logging
logger.info("Some things", {
  timestamp: new Date(),
  nested: { some: { complex: "object", with: [1, "array"] } },
  "and then": "a\nmulti\nline\nstring",
  func: function hello() {},
});
logger.warn("It is pitch black. You are likely to be eaten by a grue.");
logger.error("Unexpected monkeys", { result: new Error("HTTP 500") });
```

Uses Jest's [pretty-format](https://www.npmjs.com/package/pretty-format) package with some custom plugins.

## License

MIT
