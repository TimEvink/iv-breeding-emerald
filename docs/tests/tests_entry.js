import { utils_test_functions } from "./utils_test.js";
import { probability_test_functions } from "./probability_test.js";
//gather test functions.
const tests = [
    ...utils_test_functions,
    ...probability_test_functions
];
//run tests.
let count = 0;
console.log("-------------------------------------------------------------------------------");
console.log(`Running ${tests.length} tests.`);
for (const func of tests) {
    count++;
    try {
        func();
        console.log(`Test ${count}/${tests.length}:✅ ${func.name}`);
    }
    catch (err) {
        console.error(`Test ${count}/${tests.length}:❌ ${func.name}`);
        console.error(err);
    }
}
console.log("-------------------------------------------------------------------------------");
