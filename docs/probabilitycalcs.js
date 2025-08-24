import { gcd, combinations } from './utils.js';
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
function probability(parentAIVs, parentBIVs, targetIVs) {
    const n = targetIVs.length;
    const counts = Array(n + 1).fill(0);
    for (const config of ivconfigurationGenerator()) {
        //the override mechanic of inherited stats gets handled automatically by using a map
        const inheritedIVs = new Map(config);
        if (isRandomGenerationRemainingIVsPossible(inheritedIVs, parentAIVs, parentBIVs, targetIVs)) {
            counts[countTargetIVsInherited(inheritedIVs, parentAIVs, parentBIVs, targetIVs)]++;
        }
    }
    //counts[i] now equals the number of configurations where exactly i of the target IVs are inherited. Only configurations for which random generation can fix the result (if needed), are taken into account.
    const numerator = counts.reduce((acc, val, i) => acc + val * 32 ** i, 0);
    const denominator = 960 * 32 ** n;
    const g = gcd(numerator, denominator);
    return [numerator / g, denominator / g];
}
//generates the relevant probabilitydata in the form [parentAIVs, parentBIVs, numerator, denominator], with numerator/denominator the corresponding exact probability.
function* probabilityDataGenerator(targetIVs, options) {
    const n = targetIVs.length;
    const seen = new Set();
    for (const P of combinations(targetIVs, n - options.missingAIVs)) {
        const Pstring = P.join('');
        seen.add(Pstring);
        for (const Q of combinations(targetIVs, n - options.missingBIVs)) {
            const Qstring = Q.join('');
            if (seen.has(Qstring) && (Pstring !== Qstring)) {
                continue;
            }
            yield [P, Q, ...probability(P, Q, targetIVs)];
        }
    }
}
export function probabilityData(targetIVs, options) {
    const data = [...probabilityDataGenerator(targetIVs, options)];
    data.sort((a, b) => a[3] * b[2] - a[2] * b[3]);
    return data;
}
