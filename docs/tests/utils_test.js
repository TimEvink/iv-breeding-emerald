// @ts-ignore
import assert from "assert";
import { gcd, combinations } from '../app/utils.js';
function gcd_test() {
    assert.strictEqual(gcd(12, 18), 6);
    assert.strictEqual(gcd(7, 5), 1);
    assert.strictEqual(gcd(25, 10), 5);
    assert.strictEqual(gcd(11, 1), 1);
}
function combinations_test() {
    assert.deepStrictEqual([...combinations([1, 2, 3], -1)], []);
    assert.deepStrictEqual([...combinations([1, 2, 3], 4)], []);
    assert.deepStrictEqual([...combinations([1, 2, 3], 0)], [[]]);
    assert.deepStrictEqual([...combinations([5, 10, 7, 4], 2)], [[5, 10], [5, 7], [5, 4], [10, 7], [10, 4], [7, 4]]);
    assert.deepStrictEqual([...combinations([1, 2, 3, 4], 3)], [[1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4]]);
}
export const utils_test_functions = [
    gcd_test,
    combinations_test
];
