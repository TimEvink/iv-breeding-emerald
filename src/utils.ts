//euclidean algorithm
export function gcd(a: number, b: number): number {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

//ts implementation of pythons itertools.combinations function
export function* combinations<T>(iterable: Iterable<T>, k: number): Generator<T[], void, unknown> {
    const items = [...iterable];
    const n = items.length;
    if (k <= 0 || n < k) return;
    const indices = [...Array(k).keys()];
    yield indices.map((i) => items[i]);
    while (true) {
        let i = k - 1;
        while (i >= 0 && indices[i] === i + n - k) {
            i--;
        }
        if (i < 0) return;
        indices[i]++;
        for (let j = i + 1; j < k; j++) {
            indices[j] = indices[j - 1] + 1;
        }
        yield indices.map(i => items[i]);
    }
}
