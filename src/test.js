const { MESSAGE } = require("triple-beam");
const chalk = require("chalk");
const winston = require("winston");
const Transport = require("winston-transport");

const format = require("./format");

class MockTransport extends Transport {
  log(info, cb) {
    this.msg = info[MESSAGE];
    cb();
  }
}
const mockTransport = new MockTransport();
const logger = winston.createLogger({
  format: format(),
  transports: [mockTransport],
});

describe("Winston dev format", () => {
  const mockError = new Error("Oh no");
  mockError.stack = "Error: Oh no\n    at Here\n    at There";

  beforeEach(() => {
    jest.clearAllMocks();
    // turn off colours for nicer snapshots
    chalk.level = 0;
  });

  it("logs with colours", () => {
    chalk.level = 1;
    logger.info("hello", { some: "data" });
    expect(mockTransport.msg).toMatchInlineSnapshot(`
      "info: hello
        [90msome: [39m              \\"data\\""
    `);
  });

  it("logs error as first param", () => {
    logger.info(mockError);
    expect(mockTransport.msg).toMatchInlineSnapshot(`
      "info: Oh no
        error:              Error: Oh no
                                at Here
                                at There"
    `);
  });

  it("logs object as first param", () => {
    logger.info({ foo: "bar", boo: 1 });
    expect(mockTransport.msg).toMatchInlineSnapshot(`
      "info: 
        foo:                \\"bar\\"
        boo:                1"
    `);
  });

  it("logs object as meta param", () => {
    logger.info("Message", { foo: "bar", boo: 1 });
    expect(mockTransport.msg).toMatchInlineSnapshot(`
      "info: Message
        foo:                \\"bar\\"
        boo:                1"
    `);
  });

  it("logs circular references", () => {
    const obj = { a: "b" };
    obj.c = obj;
    logger.info("Message", { obj });
    expect(mockTransport.msg).toMatchInlineSnapshot(`
      "info: Message
        obj:                {\\"a\\": \\"b\\", \\"c\\": [Circular]}"
    `);
  });

  it("logs kitchen sink", () => {
    logger.info({
      string: "bar",
      bool: true,
      nested: { properties: { go: "deep", one: 2.345 } },
      date: new Date("2020-04-20"),
      regex: /^match(this|that)?/g,
      func: () => {},
      array: [{ an: "object" }, 1.3e-10],
      err: mockError,
      symbol: Symbol("prince"),
      "multi\nline": { "here\ntoo": "tab\ttab" },
      "escaped\\n": null,
    });

    expect(mockTransport.msg).toMatchInlineSnapshot(`
      "info: 
        string:             \\"bar\\"
        bool:               true
        nested:             {\\"properties\\": {\\"go\\": \\"deep\\", \\"one\\": 2.345}}
        date:               2020-04-20T00:00:00.000Z
        regex:              /^match(this|that)?/g
        func:               [Function func]
        array:              [{\\"an\\": \\"object\\"}, 1.3e-10]
        err:                Error: Oh no
                                at Here
                                at There
        symbol:             Symbol(prince)
        multi\\\\nline:        {\\"here\\\\ntoo\\": \\"tab\\\\ttab\\"}
        escaped\\\\\\\\n:         null"
    `);
  });
});
