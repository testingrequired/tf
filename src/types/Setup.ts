import Test from "./Test";

export default interface Setup {
  testFilePaths: Array<string>;
  components: { [key: string]: any };
  args: { [key: string]: any };
  tests: Array<Test>;
}
