# @testingrequired/tf

Build your own test framework.

## Getting Started

### Install

```bash
$ npm i -D @testingrequired/tf@latest
```

or

```bash
$ yarn add -D @testingrequired/tf@latest
```

### Add Test Script

```javascript
// package.json

{
  ...package,
  "scripts": {
    "test": "tf"
  }
}
```

### Write Some Tests

```javascript
// tests/example.test.js

let value;

beforeEach(() => {
  value = 10;
});

test(`example test`, ({ assert }) => assert.equal(value, 10));
```

### Run Those Tests

```bash
$ npm test
```

## Customize Framework

Use [middlewear](#middlewear) to customize the framework to your needs:

```javascript
// custom-tf.js
import tf, { compose, defaults, event } from "@testingrequired/tf";

export default tf(
  compose(
    defaults(),
    event("test:failure", result => {
      console.log(`${result.description} failed`);
    })
  )
);
```

### Test Script

```json
{
  "scripts": {
    "test": "tf ./custom-tf.js"
  }
}
```

### Run Tests

```bash
$ npm test
```

## Middlewear

### defaults(options)

Returns a default set of middlewear.

```javascript
tf(defaults());
```

#### Options

- testFilePatterns: `Array<string>`
- junitFilePath: `string`

#### Included Middlewear

- component("assert", assert)
- findTestFiles(`...testFilePatterns`)
- loadTests
- randomizeTestOrder
- printResultsToConsole
- runTests
- writeResultsToJunitFile(`junitFilePath`)

### findTestFiles(...patterns)

Use glob patterns to find test files to run.

```javascript
tf(findTestFiles("tests/**/*.test.js", "src/**/*.test.js"));
```

### loadTests

Read and load tests.

```javascript
tf(loadTests);
```

### runTests

Run tests.

```javascript
tf(runTests);
```

### printResultsToConsole

Print result object to console.

```javascript
tf(printResultsToConsole);
```

### randomizeTestOrder

Randomized the order tests are run.

```javascript
tf(randomizeTestOrder);
```

### writeResultsToJunitFile(filePath)

Write results to junit xml file.

```javascript
tf(writeResultsToJunitFile("junit.xml"));
```

### writeResultsToFile(filePath)

Write result object as json to file.

```javascript
tf(writeResultsToFile("results.json"));
```

### component(key, value)

Register component to be passed to test functions.

```javascript
import assert from "assert";
tf(component("assert", assert));
```

### compose(...middlewears)

Compose multiple middlewear together as a new middlewear.

```javascript
const events = compose(
  event("test:start", test => {}),
  event("test:result", result => {})
);

tf(events);
```

### event(type, callback)

Callback on event type

```javascript
tf(event("test:result", result => {}));
```

#### callback

```typescript
(payload: any) => void
```

#### Event Types

- test:start
- test:result
- test:failure
