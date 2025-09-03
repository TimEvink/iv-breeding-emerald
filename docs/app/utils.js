//euclidean algorithm
export function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}
//ts implementation of pythons itertools.combinations function
export function* combinations(iterable, k) {
    const items = [...iterable];
    const n = items.length;
    if (k === 0)
        yield [];
    if (k <= 0 || n < k)
        return;
    const indices = [...Array(k).keys()];
    yield indices.map((i) => items[i]);
    while (true) {
        let i = k - 1;
        while (i >= 0 && indices[i] === i + n - k) {
            i--;
        }
        if (i < 0)
            return;
        indices[i]++;
        for (let j = i + 1; j < k; j++) {
            indices[j] = indices[j - 1] + 1;
        }
        yield indices.map(i => items[i]);
    }
}
//caching HOF.
//the makeKey function has to be injective, i.e. different inputs generate different key strings.
export function lruCache(func, options = { maxSize: 100, shouldCache: () => true, makeKey: (...args) => JSON.stringify(args) }) {
    if (options.maxSize < 1)
        return func;
    const cache = new Map();
    function wrappedfunc(...args) {
        const key = options.makeKey(...args);
        if (cache.has(key)) {
            const value = cache.get(key);
            //set key again to update key order.
            cache.set(key, value);
            return value;
        }
        const result = func(...args);
        if (options.shouldCache(result)) {
            if (options.maxSize <= cache.size) {
                cache.delete(cache.keys().next().value);
            }
            cache.set(key, result);
        }
        return result;
    }
    return wrappedfunc;
}
