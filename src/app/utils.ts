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
    if (k === 0) yield [];
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

//caching HOF.
export function lruCache<F extends (...args: any[]) => any>(
    func: F,
    options: {
        maxSize: number;
        shouldCache: (result: ReturnType<F>) => boolean;
    } = {maxSize: 100, shouldCache: () => true}
): F {
    if (options.maxSize < 1) return func;
    const cache = new Map<string, ReturnType<F>>();
    function wrappedfunc(...args: Parameters<F>): ReturnType<F> {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            const value = cache.get(key)!;
            //set key again to update key order.
            cache.set(key, value);
            return value;
        }
        const result = func(...args);
        if (options.shouldCache(result)) {
            if (options.maxSize <= cache.size) {
                cache.delete(cache.keys().next().value as string);
            }
            cache.set(key, result);
        }
        return result;
    };
    return wrappedfunc as F;
}