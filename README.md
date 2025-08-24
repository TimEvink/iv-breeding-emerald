# IV breeding in Pokémon Emerald.

This is a tool for listing possible parent IV configurations given a set of target IV's for breeding in Pokémon Emerald.

Found at https://timevink.github.io/iv-breeding-emerald/

## Usage notes

You can toggle the table elements under 'Select target stats'. You will then see the possible configurations for sets of parent stats that can pass down their stats to a bred Pokémon with the target stats ordered by Probability.

The probability calculation assumes you have a particular IV value for each selected stat in mind, which will most likely be 31. It then assumes that every such stat, when present at some parent, has that same IV value in the Parent.

Example: say with Missing stats settings of 1 for both parents (the default), you have selected Hp, Atk and Spe, and you intend to have these stats at 31 IVs. The first result, namely

A: Hp, Atk
B: Atk, Spe

thus assumes that you work with parent A having 31 IVs in Hp and Atk, and parent B having 31 IVs in Atk and Spe. In that case the stated probability is the probability of hatching a Pokémon with 31 IVs in Hp, Atk and Spe coming from this parent pair.

## Hidden power

As mentioned above, the calculations work with any particular IV value in mind for every stat. If say you want some stat at 30 IVs, thats completely fine as long as every occurance of that stat in the parent stats has 30 IVs.

## Probability calculations

The IV inheritance in Pokémon Emerald works by following consecutive steps:
1. The IVs of a random stat from a random Parent is passed down.
2. The IVs of a random stat that is not Hp from a random Parent is passed down.
3. The IVs of a random stat that is not Hp or Def from a random Parent is passed down.
4. The IVs of the stats that were not passed down in steps 1-3, are randomly generated.

Note that steps 2 and 3 can override previous steps. For step 1 there are 12 options (6 stats, 2 parents), while step 2 has 10 options, and step 3 has 8 options. This gives in total 12 * 10 * 8 = 960 possibilities for Steps 1, 2 and 3, and each has a 1/960 chance of occuring.

The probability calculation works by brute forcing over all these 960 configurations, and checking per configuration first if its still possible for Step 4 to 'fix' the non-inherited IVs. An example is best to illustrate this: if say a Atk is a target stat (assuming 31 IVs), and if parent B for a configuration has Atk IVs not equal to 31, then if parent B ends up passing down Atk, its impossible for the random generation of remaining IVs (step 4) to end up with all desired target IVs since Atk is an inherited stat and thus gets no 'reroll'.

However when this issue does not occur, meaning its possible for Step 4 to (if needed) make the particular inheritance configuration end up in the desired target IVs, then the chance of that particular configuration ending up with the target IVs is equal to 1/960, multiplied by 1/32^k, where k is the number of target IVs that did not get passed down. The total probability is thus obtained by taking the sum of these (1/960) * (1/32^k) for all configurations for which random generation of remaining IVs can still result in obtaining all target IVs. The probability function of the probabilitycalcs.ts file does exactly that.
