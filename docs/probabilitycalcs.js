import { gcd, combinations } from './utils.js';
// for the actual inherited IVs we also remember the parents which passed down the IV in the end, so we use a map, mapping the statindex to the corresponding parentindex.
function* ivconfigurationGenerator() {
    for (let s1 = 0; s1 < 6; s1++) {
        for (const s2 of [1, 2, 3, 4, 5]) {
            for (const s3 of [1, 3, 4, 5]) {
                for (let p1 = 0; p1 < 2; p1++) {
                    for (let p2 = 0; p2 < 2; p2++) {
                        for (let p3 = 0; p3 < 2; p3++) {
                            yield [[s1, p1], [s2, p2], [s3, p3]];
                        }
                    }
                }
            }
        }
    }
}
// function inheritedIVs(config: IVinheritanceconfiguration): InheritedIVs {
//     return new Map(config);
// }
// for (const config of configurationGenerator()) {
//     console.log(config, inheritedIvs(config));
// }
function isRandomGenerationRemainingIVsPossible(inheritedIVs, parentAIVs, parentBIVs, targetIVs) {
    //returns true if the inheritedIVs can result in the targetIVs by the process of random generation of the non-inherited IV's.
    for (const [stat, parent] of inheritedIVs) {
        if (targetIVs.includes(stat)) {
            if (parent === 0 && !parentAIVs.includes(stat) || parent === 1 && !parentBIVs.includes(stat)) {
                return false;
            }
        }
    }
    return true;
}
function countTargetIVsInherited(inheritedIVs, parentAIVs, parentBIVs, targetIVs) {
    return targetIVs.reduce((count, stat) => {
        const includesA = parentAIVs.includes(stat);
        const includesB = parentBIVs.includes(stat);
        if (includesA && includesB) {
            return count + (inheritedIVs.has(stat) ? 1 : 0);
        }
        else if (includesA) {
            return count + (inheritedIVs.get(stat) === 0 ? 1 : 0);
        }
        else if (includesB) {
            return count + (inheritedIVs.get(stat) === 1 ? 1 : 0);
        }
        return count;
    }, 0);
}
// function gcd(a: number, b: number): number {
//     while (b !== 0) {
//         [a, b] = [b, a % b];
//     }
//     return a;
// }
function probability(parentAIVs, parentBIVs, targetIVs, verbose = false) {
    const n = targetIVs.length;
    const counts = Array(n + 1).fill(0);
    for (const config of ivconfigurationGenerator()) {
        const inheritedIVs = new Map(config);
        if (isRandomGenerationRemainingIVsPossible(inheritedIVs, parentAIVs, parentBIVs, targetIVs)) {
            counts[countTargetIVsInherited(inheritedIVs, parentAIVs, parentBIVs, targetIVs)]++;
        }
    }
    const numerator = counts.reduce((acc, val, i) => acc + val * 32 ** i, 0);
    const denominator = 960 * 32 ** n;
    const g = gcd(numerator, denominator);
    if (verbose) {
        console.log('Parent A IVs:', parentAIVs);
        console.log('Parent B IVs:', parentBIVs);
        console.log('Target IVs:', targetIVs);
        for (let i = Math.min(n, 3); i >= 0; i--) {
            console.log(`Number of configurations with ${i} inherited target IVs:`, counts[i]);
        }
        console.log(`Probability of obtaining target IVs: ${numerator / g}/${denominator / g} \u2248 1/${(denominator / numerator).toFixed(2)}`);
    }
    return [numerator / g, denominator / g];
}
function* configurationGenerator(targetIVs, missingIVsmin, missingIVsmax) {
    const n = targetIVs.length;
    for (let i = n - missingIVsmax; i <= n - missingIVsmin; i++) {
        for (let j = n - missingIVsmax; j <= i; j++) {
            console.log(i, j);
            const seen = new Set();
            for (const P of combinations(targetIVs, i)) {
                const Pstring = P.join('');
                seen.add(Pstring);
                for (const Q of combinations(targetIVs, j)) {
                    const Qstring = Q.join('');
                    if (seen.has(Qstring) && (Pstring !== Qstring))
                        continue;
                    yield [P, Q];
                }
            }
        }
    }
}
//outputs all the relevant probabilitydata in an array with entries of the form [parentAIVs, parentBIVs, numerator, denominator], with numerator/denominator the corresponding exact probability.
export function probabilityData(targetIVs, missingIVsmin = 1, missingIVsmax = 1) {
    const data = [];
    for (const [P, Q] of configurationGenerator(targetIVs, missingIVsmin, missingIVsmax)) {
        const [n, d] = probability(P, Q, targetIVs);
        data.push([P, Q, n, d]);
    }
    data.sort((a, b) => a[3] * b[2] - a[2] * b[3]);
    return data;
}
// for (const [P, Q] of combinationsGenerator([0, 1, 2, 3], 1, 2)) {
//     console.log(P, Q);
// }
// console.log(probability([0], [1], [0, 1]));
// console.log(probability([0, 1], [0, 5], [0, 1, 5], true));
