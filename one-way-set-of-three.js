#!/usr/bin/env node

const dicelib = require('./dicelib');
const status = require('./status');

const dice = 3;
const minValue = 0;
const maxValue = 9;
let bestMinOdds = 0.50001; // Starting threshold - try to beat even odds
bestMinOdds = 0.5557;

function compareRolls(dieIndex1, dieIndex2) {
    return dicelib.compareDieRollStrings(dieSides[dieIndex1], dieSides[dieIndex2]);
}

function displayDuringProgress(label, indices) {
    status.clear();
    dicelib.showComparison(label, indices, dieSides);
}

let tallies = 0;
console.log('Min value on a side:', minValue);
console.log('Max value on a side:', maxValue);
console.log('Tabulating distinct die configurations');
let dieSides = [];
dicelib.rollDie(minValue, maxValue, die => {
    dieSides.push(die.join(' '));
});
console.log('Possible combinations:', dieSides.length);

// [dieSidesIndex][dieSidesIndex] = percentageOfWins
dieSideVsSide = [];

// [dieSidesIndex] = [indexOfUsableSide, indexOfUsableSide, ...]
dieSideVsSideFavorable = [];
console.log('Calculating odds');

for (let a = 0; a < dieSides.length; a += 1) {
    status.show(`${a} / ${dieSides.length}`);
    dieSideVsSide[a] = [];

    for (let b = 0; b < dieSides.length; b += 1) {
        dieSideVsSide[a][b] = dicelib.compareDieRollStrings(dieSides[a], dieSides[b]);
    }
}

status.clear();
console.log('Eliminating below minimum threshold:', bestMinOdds);

let loopAgain = true;
let filterPass = 1;

while (loopAgain) {
    loopAgain = false;
    for (let a = 0; a < dieSides.length;) {
        const max = Math.max(...dieSideVsSide[a]);

        if (max >= bestMinOdds) {
            a += 1;
        } else {
            dieSides.splice(a, 1);

            for (let x = 0; x < dieSideVsSide.length; x += 1) {
                dieSideVsSide[x].splice(a, 1);
            }

            dieSideVsSide.splice(a, 1);
            loopAgain = true;
        }

        status.show(`Pass ${filterPass}: ${a} / ${dieSides.length}`);
    }
    filterPass += 1;
}

status.clear();
console.log('Final number of rolls:', dieSides.length);

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
dicelib.showComparison('Best minimum odds', bestMinOddsRollIndexes, dieSides);
