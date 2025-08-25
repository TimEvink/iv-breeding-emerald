// @ts-ignore
import assert from "assert";
import { ivconfigurationGenerator, isRandomGenerationRemainingIVsPossible, probability } from '../app/probabilitycalcs.js';
function ivconfigurationGenerator_test() {
    assert.deepStrictEqual([...ivconfigurationGenerator()].length, 960);
}
function isRandomGenerationRemainingIVsPossible_test() {
    assert.deepStrictEqual(isRandomGenerationRemainingIVsPossible(new Map([[0, 1], [1, 0], [4, 1]]), [0, 4], [1, 4], [0, 1, 4]), false);
    assert.deepStrictEqual(isRandomGenerationRemainingIVsPossible(new Map([[0, 1], [1, 0], [4, 1]]), [1, 4], [0, 4], [0, 1, 4]), true);
    assert.deepStrictEqual(isRandomGenerationRemainingIVsPossible(new Map([[0, 1], [1, 0], [3, 1]]), [1, 4], [0, 4], [0, 1, 4]), true);
}
function probability_test() {
    assert.deepStrictEqual(probability([0], [0], [0]), [37, 192]);
    assert.deepStrictEqual(probability([1], [1], [1]), [33, 64]);
    assert.deepStrictEqual(probability([2], [2], [2]), [17, 48]);
    assert.deepStrictEqual(probability([0, 2], [2, 5], [0, 2, 5]), [4127, 786432]);
}
export const probability_test_functions = [
    ivconfigurationGenerator_test,
    isRandomGenerationRemainingIVsPossible_test,
    probability_test
];
