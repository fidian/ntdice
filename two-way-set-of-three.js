#!/usr/bin/env node

const diceLib = require('./dice-lib');
const status = require('./status');

const dice = 3;
const minValue = 1;
const maxValue = 6;
let bestMinOdds = 0.50001; // Starting threshold - try to beat even odds

function displayDuringProgress(label, indices) {
    status.clear();
    diceLib.showDoubledComparison(label, indices, dieSides, doubledRolls);
}

let tallies = 0;
console.log('Min value on a side:', minValue);
console.log('Max value on a side:', maxValue);
const dieSides = diceLib.dieCombinations(minValue, maxValue);
const doubledRolls = diceLib.doubleRolls(dieSides);
console.log('Possible combinations:', dieSides.length);

dieVsDie = diceLib.calculateDoubledOdds(doubledRolls);
diceLib.filterMinimumThreshold(0, bestMinOdds, dieSides, dieVsDie, doubledRolls);

let bestMinOddsRollIndexes = [0, 0, 0];
let bestAvgOdds = 0.0001;
let totalChecks = 0;

// 'a' is the lowest die roll index. All others must be equal to 'a' or larger.
for (let a = 0; a < dieSides.length - 2; a += 1) {
    for (let b = a; b < dieSides.length; b += 1) {
        status.show(`${dieSides.length}: ${a} ${b}`);
        const oddsBA = dieVsDie[b][a];

        if (oddsBA >= bestMinOdds) {
            // This correctly says "c = a"
            for (let c = a; c < dieSides.length; c += 1) {
                const oddsCB = dieVsDie[c][b];
                const oddsAC = dieVsDie[a][c];
                const minOdds = Math.min(oddsBA, oddsCB, oddsAC);
                const avgOdds = (oddsBA + oddsCB + oddsAC) / 3;
                totalChecks += 1;

                if (minOdds > bestMinOdds) {
                    bestMinOdds = minOdds;
                    bestAvgOdds = avgOdds;
                    bestMinOddsRollIndexes = [a, b, c];
                    displayDuringProgress('Better minimum odds', bestMinOddsRollIndexes);
                } else if (minOdds === bestMinOdds) {
                    if (avgOdds > bestAvgOdds) {
                        bestMinOdds = minOdds;
                        bestAvgOdds = avgOdds;
                        bestMinOddsRollIndexes = [a, b, c];
                        displayDuringProgress('Better average odds', bestMinOddsRollIndexes);
                    } else if (avgOdds === bestAvgOdds) {
                        displayDuringProgress('Matching odds', [a, b, c]);
                    }
                }
            }
        }
    }
}

status.clear();
console.log('Total checks:', totalChecks);
diceLib.showDoubledComparison('Best minimum odds', bestMinOddsRollIndexes, dieSides, doubledRolls);
