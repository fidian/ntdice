#!/usr/bin/env node

const dicelib = require('./dicelib');
const status = require('./status');

const dice = 3;
const minValue = 1;
const maxValue = 6;
let bestMinOdds = 0.50001; // Starting threshold - try to beat even odds

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

console.log('Eliminate entries that can not beat percentage:', bestMinOdds);
dieSides = dieSides.filter((rolls, index) => {
    for (let i = 0; i < dieSides.length; i += 1) {
        if (compareRolls(index, i) >= bestMinOdds) {
            return true;
        }
    }

    return false;
});
console.log('Possible combinations remaining:', dieSides.length);

let bestMinOddsRollIndexes = [0, 0, 0];
let bestAvgOdds = 0.0001;
let totalChecks = 0;

// 'a' is the lowest die roll index. All others must be equal to 'a' or larger.
for (let a = 0; a < dieSides.length - 2; a += 1) {
    for (let b = a; b < dieSides.length; b += 1) {
        status.show(`${dieSides.length}: ${a} ${b}`);
        const oddsAB = compareRolls(a, b);

        if (oddsAB >= bestMinOdds) {
            // This correctly says "c = a"
            for (let c = a; c < dieSides.length; c += 1) {
                const oddsBC = compareRolls(b, c);
                const oddsCA = compareRolls(c, a);
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

console.log('Total checks:', totalChecks);
status.clear();
dicelib.showComparison('Best minimum odds', bestMinOddsRollIndexes, dieSides);
