import Middleware, { ResultsExecutor } from "./types/Middleware";
import Setup from "./types/Setup";
import Results from "./types/Results";
import { EventEmitter } from "events";
import lowestNonZero from "./utils/lowestNonZero";

/**
 * Returns a function that executes middlewares
 *
 * Eeach middleware setup function and each optionally returned results function
 *
 * @param middlewares Middlewares to run
 * @returns {() => void} Function that executes middlewares
 */
const config = (...middlewares: Array<Middleware>) => async () => {
  const setup: Setup = {
    events: new EventEmitter(),
    testFilePaths: [],
    assertionErrorsTypes: [],
    globals: {},
    tests: [],
    args: {},
    fixtures: {}
  };
  const capturedExitCodes: Array<number> = [];

  setup.events.on("exit", (exitCode: number) => {
    capturedExitCodes.push(exitCode);
  });

  const results: Results = [];

  const resultExecutors: Array<ResultsExecutor> = [];

  for (const middleware of middlewares) {
    const resultExecutor = await middleware(setup);

    if (resultExecutor) {
      resultExecutors.push(resultExecutor);
    }
  }

  setup.events.emit("setup", setup);

  if (capturedExitCodes.length > 0) {
    return lowestNonZero(capturedExitCodes);
  }

  for (const resultExector of resultExecutors) {
    await resultExector(results);
  }

  if (capturedExitCodes.length > 0) {
    return lowestNonZero(capturedExitCodes);
  }

  return 0;
};

export default config;
