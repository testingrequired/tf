import { run, config, middleware } from './index';

const { starter, specSyntax, matchTestFiles, random, mock } = middleware;

describe('Integration', () => {

  // @ts-ignore
  let oldExit: any;
  // @ts-ignore
  let oldDateNow: any;

  let logs: Array<Array<string>>;

  beforeEach(() => {
    oldExit = process.exit;
    oldDateNow = Date.now;

    (process.exit as any) = jest.fn();

    logs = [];

    (global as any).console = new Proxy(console, {
      get: (target, prop: string) => {
        return (...args: Array<string>) => {
          logs.push(args);
        }
      }
    });

    Date.now = jest.fn()
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(200);
  });

  it('should work', () => {
    run(
      config(
        starter,
        matchTestFiles("./tests/**/*.test.js"),
        specSyntax,
        random,
        mock
      )
    );

    expect(logs.join("\n")).toMatchSnapshot();
  });
});