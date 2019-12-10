#!/usr/bin/env node

const diceLib = require('./dice-lib');
const status = require('./status');

const dice = 3;
const minValue = 1;
const maxValue = 6;
let bestMinOdds = 0.50001; // Starting threshold - try to beat even odds
bestMinOdds = 0.5557;

function displayDuringProgress(label, indices) {
    status.clear();
    diceLib.showComparison(label, indices, dieSides);
}

let tallies = 0;
console.log('Min value on a side:', minValue);
console.log('Max value on a side:', maxValue);
dieSides = diceLib.dieCombinations(minValue, maxValue);
console.log('Possible combinations:', dieSides.length);

dieSideVsSide = diceLib.calculateOdds(dieSides);
diceLib.filterMinimumThreshold(bestMinOdds, dieSides, dieSideVsSide);

let bestMinOddsRollIndexes = [0, 0, 0];
let bestAvgOdds = 0.0001;
let totalChecks = 0;

// 'a' is the lowest die roll index. All others must be equal to 'a' or larger.
for (let a = 0; a < dieSides.length - 2; a += 1) {
    for (let b = a; b < dieSides.length; b += 1) {
        status.show(`${dieSides.length}: ${a} ${b}`);
        const oddsAB = dieSideVsSide[a][b];

        if (oddsAB >= bestMinOdds) {
            // This correctly says "c = a"
            for (let c = a; c < dieSides.length; c += 1) {
                const oddsBC = dieSideVsSide[b][c];
                const oddsCA = dieSideVsSide[c][a];
                const minOdds = Math.min(oddsAB, oddsBC, oddsCA);
                const avgOdds = (oddsAB + oddsBC + oddsCA) / 3;
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
diceLib.showComparison('Best minimum odds', bestMinOddsRollIndexes, dieSides);
