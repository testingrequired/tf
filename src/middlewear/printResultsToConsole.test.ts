import printResultsToConsole from "./printResultsToConsole";
import Setup from "../types/Setup";
import Results from "../types/Results";

describe("printResultsToConsole", () => {
  const setup: Setup = {
    testFilePaths: [],
    components: {},
    tests: []
  };

  const results: Results = [
    {
      description: "foo",
      state: "passed",
      start: new Date(),
      end: new Date()
    }
  ];

  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log");
  });

  it("should call console.log with json stringified results", () => {
    printResultsToConsole(setup, results);

    expect(logSpy).toBeCalledWith(JSON.stringify(results, null, 2));
  });
});
