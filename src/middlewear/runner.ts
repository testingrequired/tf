import Setup from "../types/Setup";
import Results from "../types/Results";
import Result from "../types/Result";
import { EventEmitter } from "events";
import { AssertionError } from "assert";

export default function runTests(setup: Setup, events: EventEmitter) {
  return (results: Results) => {
    const { tests, globals } = setup;

    tests.forEach(test => {
      const { testFilePath, description, fn, runState } = test;

      events.emit("test:start", test);

      let result: Result = {};
      let start = new Date();

      result.testFilePath = testFilePath;
      result.description = description;

      switch (runState) {
        case "run":
          try {
            createGlobals(globals);
            fn.call(undefined);
            result.state = "passed";
          } catch (e) {
            if (e instanceof AssertionError) {
              result.state = "failed";
              result.error = e;
              events.emit("test:failure", result);
            } else {
              result.state = "errored";
              result.error = e;
              events.emit("test:error", result);
            }
          } finally {
            removeGlobals(globals);
          }
          break;

        case "skip":
          result.state = "skipped";
          events.emit("test:skip", result);
          break;

        default:
          throw new Error(`Invalid test run state: ${runState}`);
      }

      result.start = start;
      result.end = new Date();

      events.emit("test:result", result);

      results.push(result);
    });
  };
}

function createGlobals(globals) {
  Object.entries(globals).forEach(i => {
    const [key, value] = i;

    (global as any)[key] = value;
  });
}

function removeGlobals(globals) {
  Object.entries(globals).forEach(i => {
    const [key, value] = i;

    (global as any)[key] = value;
  });
}
