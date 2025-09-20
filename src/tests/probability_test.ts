import * as assert from "node:assert";

import { ivconfigurationGenerator, isRandomGenerationRemainingIVsPossible, countTargetIVsInherited, probability } from '../app/probabilitycalcs.js';

function ivconfigurationGenerator_test(): void {
    assert.deepStrictEqual([...ivconfigurationGenerator()].length, 960);
}

function isRandomGenerationRemainingIVsPossible_test(): void {
    assert.deepStrictEqual(isRandomGenerationRemainingIVsPossible(
        new Map([[0, 1], [1, 0], [4, 1]]),
        [0, 4],
        [1, 4],
        [0, 1, 4]
    ), false);
    assert.deepStrictEqual(isRandomGenerationRemainingIVsPossible(
        new Map([[0, 1], [1, 0], [4, 1]]),
        [1, 4],
        [0, 4],
        [0, 1, 4]
    ), true);
    assert.deepStrictEqual(isRandomGenerationRemainingIVsPossible(
        new Map([[0, 1], [1, 0], [3, 1]]),
        [1, 4],
        [0, 4],
        [0, 1, 4]
    ), true);
}

function countTargetIVsInherited_test(): void {
    assert.strictEqual(countTargetIVsInherited(
        new Map([[0, 0], [3, 1], [5, 0]]),
        [0, 4],
        [2],
        [0, 3, 4]
    ), 1);
    assert.strictEqual(countTargetIVsInherited(
        new Map([[0, 1], [3, 1], [5, 0]]),
        [0, 4],
        [5],
        [0, 3, 4]
    ), 0);
    assert.strictEqual(countTargetIVsInherited(
        new Map([[0, 0], [1, 1], [5, 1]]),
        [0, 1],
        [1, 5],
        [0, 1, 5]
    ), 3);
}

function probability_test(): void {
    assert.deepStrictEqual(probability([0], [0], [0]), [37, 192]);
    assert.deepStrictEqual(probability([1], [1], [1]), [33, 64]);
    assert.deepStrictEqual(probability([2], [2], [2]), [17, 48]);
    assert.deepStrictEqual(probability([0, 2], [2, 5], [0, 2, 5]), [4127, 786432]);
}

export const probability_test_functions = [
    ivconfigurationGenerator_test,
    isRandomGenerationRemainingIVsPossible_test,
    countTargetIVsInherited_test,
    probability_test
];
