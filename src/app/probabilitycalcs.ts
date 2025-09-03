import { gcd, combinations, lruCache } from './utils.js';
import { ConfigurationOptions, IVinheritanceconfiguration, InheritedIVs } from './interfaces.js';

//stats are worked internally with by integers: we use 0, 1, 2, 3, 4, 5 for HP, Atk, Def, Sp.A, Sp.D and Spe, respectively.
//also: 0 is used for parent A, 1 is used for parent B.

// example: [[0, 0], [4, 1], [5, 0]] means in the inheritance process we have in order:
// - HP is passed from parent A
// - Sp.D is passed from parent B
// - SpE is passed from A
//
// the order is important as newer steps can override previously inherited stats.

export function* ivconfigurationGenerator(): Generator<IVinheritanceconfiguration, void, unknown> {
    for (let s1 = 0; s1 < 6; s1++) {
        for (let s2 = 1; s2 < 6; s2++) {
            for (let s3 = 1; s3 < 6; s3++) {
                if (s3 === 2) continue; 
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

export function isRandomGenerationRemainingIVsPossible(
    inheritedIVs: InheritedIVs,
    parentAIVs: number[],
    parentBIVs: number[],
    targetIVs: number[]
): boolean {
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

export function countTargetIVsInherited(
    inheritedIVs: InheritedIVs,
    parentAIVs: number[],
    parentBIVs: number[],
    targetIVs: number[]
): number {
    return targetIVs.reduce((count, stat) => {
        const includesA = parentAIVs.includes(stat);
        const includesB = parentBIVs.includes(stat);
        if (includesA && includesB) {
            return count + (inheritedIVs.has(stat) ? 1 : 0);
        } else if (includesA) {
            return count + (inheritedIVs.get(stat) === 0 ? 1 : 0);
        } else if (includesB) {
            return count + (inheritedIVs.get(stat) === 1 ? 1 : 0);
        }
        return count;
    }, 0);
}

export function probability(
    parentAIVs: number[],
    parentBIVs: number[],
    targetIVs: number[]
): [number, number] {
    const n = targetIVs.length;
    const counts: number[] = Array(n + 1).fill(0);
    for (const config of ivconfigurationGenerator()) {
        //the override mechanic of inherited stats gets handled automatically by using a map
        const inheritedIVs: InheritedIVs = new Map(config);
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

//array entries are of the form [parentAIVs, parentBIVs, numerator, denominator], with numerator/denominator the corresponding exact probability.
function probabilityData(
    targetIVs: number[],
    options: ConfigurationOptions
): [number[], number[], number, number][] {
    function* dataGenerator(): Generator<[number[], number[], number, number], void, unknown> {
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
    const data = [...dataGenerator()];
    data.sort((a, b) => a[3] * b[2] - a[2] * b[3]); 
    return data;
}

//probabilityData wrapped to add caching.
export const probabilityDataWithCache = lruCache(
    probabilityData,
    {
        maxSize: 20,
        shouldCache: (data) => data.length > 3,
        makeKey: (targetIVs, options) => `${options.missingAIVs}${options.missingBIVs}${targetIVs.join('')}`
    }
);
