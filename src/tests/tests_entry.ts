import { utils_test_functions } from "./utils_test.js";
import { probability_test_functions } from "./probability_test.js";

function runTest(name: string, func: () => void) {
  try {
    func();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(err);
  }
}

//gather tests.
const tests = [
  ...utils_test_functions,
  ...probability_test_functions
];

//run tests.
for (const func of tests) {
    runTest(func.name, func);
}