import Setup from "../types/Setup";
import { EventEmitter } from "events";
import Result from "../types/Result";

export default function printResults(setup: Setup, events?: EventEmitter) {
  events.on("test:result", (result: Result) => {
    console.log(JSON.stringify(result, jsonFriendlyErrorReplacer, 2));
  });
}

function jsonFriendlyErrorReplacer(key, value) {
  if (value instanceof Error) {
    return {
      // Pull all enumerable properties, supporting properties on custom Errors
      ...value,
      // Explicitly pull Error's non-enumerable properties
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }

  return value;
}
