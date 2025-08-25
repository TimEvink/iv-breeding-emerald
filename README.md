# IV breeding in Pokémon Emerald

This is a tool for listing possible parent IV configurations given a set of target IVs for breeding in Pokémon Emerald.

Found at https://timevink.github.io/iv-breeding-emerald.

## Usage

1. Select target stats by clicking the table headers.
2. Adjust the number of missing target stats for each parent (default: 1).
3. View possible parent stat configurations with probabilities.

## Notes

The probability calculation assumes you have a particular IV value for each selected stat in mind, which will likely be 31. It then assumes that every such stat, when present at some parent, has that same IV value for the parent. This also means that if for example you want some stat at 30 IVs for Hidden Power reasons, then the calculations are still valid as long as *every* occurrence of that stat in the parent stats has 30 IVs.

## Examples

Say you have selected Hp, Atk and Spe, and you intend to have these stats at 31 IVs. The first result, namely

- parent A: Hp, Atk
- parent B: Atk, Spe

thus assumes that you work with parent A having 31 IVs in Hp and Atk, and parent B having 31 IVs in Atk and Spe. The corresponding probability is then the probability of hatching a Pokémon with 31 IVs in Hp, Atk and Spe coming from this parent pair.

Now say you want to breed a Beldum with 31 IVs in 4 stats from:

- Parent A: a Beldum with 31 IVs in 3 of the 4.
- Parent B: a Ditto with 31 IVs in 2 of the 4.

You'd then set the number of missing stat options to 1 for parent A, and 2 for parent B, since in that setup parent A will have $$1 = 4 - 3$$ missing stat, while parent B will have $$2 = 4 - 2$$ missing stats. 

## Probability calculations

The probability calculations are performed by the function ```probability``` in ```src/probabilitycalcs.ts```. In this section an explanation is given on why this function actually ends up with the correct probabilities.

The IV inheritance in Pokémon Emerald works by following consecutive steps:

1. choose 1 random stat from a random parent → 12 options
2. choose 1 random stat (not HP) from a random parent → 10 options
3. choose 1 random stat (not HP or Def) from a random parent → 8 options

this gives in total:  12 × 10 × 8 = **960 possibilities** for IV inheritance configurations.

4. The IVs of the stats that were not passed down in steps 1-3, are randomly generated.

The probability calculation works by brute forcing over all these 960 configurations, and checking per configuration first if its still possible for step 4 to 'fix' the non-inherited stats. An example is best to illustrate this: say Atk is a target stat (assuming 31 IVs), parent A has 31 Atk IVs, but parent B has Atk IVs not equal to 31. If parent B ends up passing down Atk, its impossible for the random generation of remaining IVs (step 4) to end up with all desired target IVs since Atk is an inherited stat and thus gets no 'reroll'.
If such an issue does not happen, i.e. its possible for step 4 to (if needed) make the particular inheritance configuration end up in the desired target IVs, then the chance of that particular configuration ending up with the target IVs is equal to 1/32^k, where k is the number of target stats that did not get passed down. We thus end up with a total probability of

$$
\frac{1}{960}\sum_c \frac{1}{32^{k_c}}
$$

with the sum running over all configurations $$c$$ for which random generation of remaining IVs can still result in obtaining all target stats with desired IVs, and $$k_c$$ equals the number of target stats that where not passed down by configuration $$c$$.

## Development

This project is written in TypeScript and plain HTML/CSS. The project structure is as follows.

```markdown
iv-breeding-emerald/
├── src/
│ ├── app/ --> .ts source code
│ └── tests/ --> .ts tests
├── docs/ --> ts build outout
│ ├── app/ --> compiled app, gets served by gh-pages.
│ │ ├── *.js --> from src/app
│ │ ├── index.html --> manually placed
│ │ └── styles.css --> manually placed
│ └── tests/ --> compiled tests
⋮
```

To build locally you'll need Node installed and clone the repo. Running from the project root

```bash
npm i
```
will install ```typescript``` and ```http-server``` locally inside the project as dev dependencies; there are no dependencies for the served files.

To compile the typescript you can run either
```bash
npm run build
```
or just
```bash
tsc
```

This will compile the .ts files from ```src/``` to .js files in ```docs/```, including the tests. For local serving you can run

```bash
npm start
```
which will serve the page from docs/app/ using ```http-server```.
