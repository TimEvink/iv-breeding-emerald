import { gcd, combinations } from './utils.js'

//stats are worked internally with by integers 0, 1, 2, 3, 4, 5, for respectively HP, Atk, Def, Sp.A, Sp.D and Spe.
//also: 0 is used for parent A, 1 is used for parent B.
type IVinheritanceconfiguration = [
  [number, number],
  [number, number],
  [number, number]
];
// example: [[0, 0], [4, 1], [5, 0]] means in the inheritance process we have in order:
// - HP is passed from parent A
// - Sp.D is passed from parent B
// - SpE is passed from A
//
// the order is important as newer steps can override previously inherited stats.

type InheritedIVs = Map<number, number>;
// for the actual inherited IVs we also remember the parents which passed down the IV in the end, so we use a map, mapping the statindex to the corresponding parentindex.

function* ivconfigurationGenerator(): Generator<IVinheritanceconfiguration, void, unknown> {
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

function isRandomGenerationRemainingIVsPossible(
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

function countTargetIVsInherited(
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

function probability(
    parentAIVs: number[],
    parentBIVs: number[],
    targetIVs: number[],
    verbose: boolean = false
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
    const numerator = counts.reduce((acc, val, i) => acc + val * 32 ** i, 0);
    const denominator = 960 * 32 ** n;
    const g = gcd(numerator, denominator);
    return [numerator / g, denominator / g];
}

function* configurationGenerator(
    targetIVs: number[],
    missingIVsmin: number,
    missingIVsmax: number
): Generator<[number[], number[]]> {
    const n = targetIVs.length;
    for (let i = n - missingIVsmax; i <= n - missingIVsmin; i++) {
        for (let j = n - missingIVsmax; j <= i; j++) {
            const seen = new Set();
            for (const P of combinations<number>(targetIVs, i)) {
                const Pstring = P.join('');
                seen.add(Pstring);
                for (const Q of combinations<number>(targetIVs, j)) {
                    const Qstring = Q.join('');
                    if (seen.has(Qstring) && (Pstring !== Qstring)) continue;
                    yield [P, Q];
                }
            }
        }
    }
}

//outputs all the relevant probabilitydata in an array with entries of the form [parentAIVs, parentBIVs, numerator, denominator], with numerator/denominator the corresponding exact probability.
export function probabilityData(
    targetIVs: number[],
    missingIVsmin: number = 1,
    missingIVsmax: number = 1
): [number[], number[], number, number][] {
    const data: [number[], number[], number, number][] = [];
    for (const [P, Q] of configurationGenerator(targetIVs, missingIVsmin, missingIVsmax)) {
        const [n, d] = probability(P, Q, targetIVs);
        data.push([P, Q, n, d]);
    }
    data.sort((a, b) => a[3] * b[2] - a[2] * b[3]); 
    return data;
}
