# Winston Dev Format

## What

Pretty log output for local development.

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
logger.error("Unexpected item in the logging area");
logger.warn("Some thing", { err: new Error("oh no") });
logger.info("More things", {
  with: { a: new Date(), or: 2e-10 },
  "and then": "line\nbreak",
  func: function hello() {},
});
```

Uses Jest's [pretty-format](https://www.npmjs.com/package/pretty-format) package with some custom plugins.


## License

MIT
