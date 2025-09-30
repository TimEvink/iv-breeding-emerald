# IV breeding in Pokémon Emerald

This is a tool for listing possible parent IV configurations given a set of target IVs for breeding in Pokémon Emerald.

Found at https://timevink.github.io/iv-breeding-emerald.

## Usage

1. Select target stats by clicking the table headers.
2. Adjust the number of missing target stats for each parent (default: 1).
3. View possible parent stat configurations with probabilities.

## Notes

The probability calculation assumes you have a particular IV value for each selected stat in mind, which will likely be 31. It then assumes that every such stat, when present at some parent, has that same IV value for the parent.

This also means that if for example you want some stat at 30 IVs for Hidden Power reasons, then the calculations are still valid as long as *every* occurrence of that stat in the parent stats has 30 IVs. It should be stressed that the end probabilities do not take a target Hidden Power into account.

## Examples

Say you have selected HP, Atk and Spe, and you intend to have these stats at 31 IVs. The first result, namely

- parent A: HP, Atk
- parent B: Atk, Spe

thus assumes that you work with parent A having 31 IVs in HP and Atk, and parent B having 31 IVs in Atk and Spe. The corresponding probability is then the probability of hatching a Pokémon with 31 IVs in HP, Atk and Spe coming from this parent pair.

Now say you want to breed a Beldum with 31 IVs in 4 stats from:

- Parent A: a Beldum with 31 IVs in 3 of the 4.
- Parent B: a Ditto with 31 IVs in 2 of the 4.

You'd then set the number of missing stat options to 1 for parent A, and 2 for parent B, since in that setup parent A will have $$1 = 4 - 3$$ missing stat, while parent B will have $$2 = 4 - 2$$ missing stats. 

## Probability calculations

The probability calculations are performed by the function ```probability``` in ```src/probabilitycalcs.ts```. In this section an explanation is given on why this function actually ends up with the correct probabilities.

The IV inheritance in Pokémon Emerald works by following four consecutive steps:

1. choose 1 random stat from a random parent → 12 options.
2. choose 1 random stat (not HP) from a random parent → 10 options.
3. choose 1 random stat (not HP or Def) from a random parent → 8 options.

This gives in total:  12 × 10 × 8 = **960 possibilities** for IV inheritance configurations, each occuring with equal probability (1/960).

4. the IVs of the stats that were not passed down as a result of steps 1-3, are randomly generated.

The probability calculation works by brute forcing over all these 960 configurations, and checking per configuration first if its still possible for step 4 to 'fix' the non-inherited stats. An example is best to illustrate how this can go wrong. Say Atk is a target stat (assuming 31 IVs), parent A has 31 Atk IVs, but parent B has Atk IVs not equal to 31. If parent B ends up passing down Atk, its impossible for the random generation of remaining IVs (step 4) to end up with all desired target IVs since Atk is an inherited stat and thus gets no 'reroll'. When such a situation doesn't occur, i.e. when its possible for step 4 to (if needed) make the particular inheritance configuration end up in the desired target IVs, then the chance of that particular configuration ending up with the target IVs is equal to 1/32^k, where k is the number of target stats that did not get passed down. We thus end up with a total probability of

$$
\frac{1}{960}\sum_c \frac{1}{32^{k_c}}
$$

with the sum running over all configurations $$c$$ for which random generation of remaining IVs can still result in obtaining all target stats with desired IVs, and $$k_c$$ equals the number of target stats that where not passed down by configuration $$c$$. The actual implementation uses a reorganisation of this expression by grouping together configurations $$c$$ which have the same $$k_c$$. Specifically, the probability also equals

$$
\frac{1}{960}\left(C_n + \frac{C_{n-1}}{32} + ... + \frac{C_0}{32^n} \right),
$$

where $$n$$ is the number of target IVs and $$C_i$$ is the number of 'by step 4 fixable' IV inheritance configurations for which exactly i of the target IVs are inherited
(note that $$C_i = 0$$ if $$i > 3$$ as no more than 3 IVs can ever be inherited).

## Development

This project is written in TypeScript and plain HTML/CSS. The project structure is as follows.

```markdown
iv-breeding-emerald/
├── src/ --> root .ts directory
│ ├── app/ --> .ts source code
│ ├── tests/ --> .ts tests
│ └── serve.ts --> for local serving
├── docs/ --> ts build outout
│ ├── app/ --> compiled app, gets served by gh-pages
│ │ ├── *.js --> from src/app/
│ │ ├── index.html --> manually placed
│ │ ├── styles.css --> manually placed
│ │ └── favicon.ico --> manually placed
| ├── tests/
| └── serve.js
⋮
```

To build locally you'll need Node installed and clone the repo. Running from the project root

```bash
npm i
```

will install ```typescript``` and ```@types/node``` locally inside the project as dev dependencies; there are no dependencies for the served files.

To compile the typescript you can run

```bash
npm run build
```

This will compile all ```.ts``` files from ```src/``` to ```.js``` files in ```docs/```.

To serve locally you can run

```bash
npm start
```

which will serve the page on localhost:3000. If you want a different port you can add an optional argument. For example ```npm start 8000``` will serve on port 8000.

For running tests you can run

```
npm test
```

## Attributions
Favicon sprite © Nintendo/Game Freak/The Pokémon Company. Used for educational purposes under fair use.
