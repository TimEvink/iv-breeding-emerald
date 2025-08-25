// @ts-ignore
import assert from "assert";

import { ivconfigurationGenerator, isRandomGenerationRemainingIVsPossible, countTargetIVsInherited, probability, probabilityData } from '../app/probabilitycalcs.js';

function ivconfigurationGenerator_test() {
    assert.deepStrictEqual([...ivconfigurationGenerator()].length, 960);
}

function isRandomGenerationRemainingIVsPossible_test() {

}

function countTargetIVsInherited_test() {

}

function probability_test() {

}

function probabilityData_test() {

}

export const probability_test_functions = [
    ivconfigurationGenerator_test,
    isRandomGenerationRemainingIVsPossible_test,
    countTargetIVsInherited_test,
    probability_test,
    probabilityData_test
];