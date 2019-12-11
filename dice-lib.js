const status = require("./status");

function rollDie(min, max, cb) {
    for (let a = min; a <= max; a += 1) {
        for (let b = a; b <= max; b += 1) {
            for (let c = b; c <= max; c += 1) {
                for (let d = c; d <= max; d += 1) {
                    for (let e = d; e <= max; e += 1) {
                        for (let f = e; f <= max; f += 1) {
                            cb([a, b, c, d, e, f]);
                        }
                    }
                }
            }
        }
    }
}

exports.dieCombinations = (minValue, maxValue) => {
    let dieSides = [];
    console.log("Tabulating distinct die configurations");

    rollDie(minValue, maxValue, (die) => {
        dieSides.push(die);
    });

    console.log("Possible combinations:", dieSides.length);

    return dieSides;
};

function compareRolls(rolls1, rolls2) {
    let wins = 0;

    for (const one of rolls1) {
        for (const two of rolls2) {
            if (one > two) {
                wins += 1;
            }
        }
    }

    return wins / (rolls1.length * rolls2.length);
}

exports.calculateOdds = (dieSides) => {
    console.log("Calculating odds");

    const dieVsDie = [];

    for (let a = 0; a < dieSides.length; a += 1) {
        status.show(`${a} / ${dieSides.length}`);
        dieVsDie[a] = [];

        for (let b = 0; b < dieSides.length; b += 1) {
            dieVsDie[a][b] = compareRolls(dieSides[a], dieSides[b]);
        }
    }

    status.clear();

    return dieVsDie;
};

function doubleOneRoll(sides) {
    const result = {};

    for (let a of sides) {
        for (let b of sides) {
            result[a + b] = 1 + (result[a + b] || 0);
        }
    }

    return result;
}

exports.doubleRolls = (rolls) => {
    const result = [];

    for (let i = 0; i < rolls.length; i += 1) {
        result[i] = doubleOneRoll(rolls[i]);
    }

    return result;
};

function compareDoubledRolls(rolls1, rolls2) {
    let wins = 0;
    let total = 0;

    for (const [roll1, fact1] of Object.entries(rolls1)) {
        const roll1int = +roll1;

        for (const [roll2, fact2] of Object.entries(rolls2)) {
            if (roll1int > +roll2) {
                wins += fact1 * fact2;
            }

            total += fact1 * fact2;
        }
    }

    return wins / total;
}

exports.calculateDoubledOdds = (doubledRolls) => {
    console.log("Calculating doubled odds");

    const dieVsDie = [];

    for (let a = 0; a < doubledRolls.length; a += 1) {
        status.show(`${a} / ${doubledRolls.length}`);
        dieVsDie[a] = [];

        for (let b = 0; b < doubledRolls.length; b += 1) {
            dieVsDie[a][b] = compareDoubledRolls(doubledRolls[a], doubledRolls[b]);
        }
    }

    status.clear();

    return dieVsDie;
};

function roundPercent(n) {
    return Math.round(n * 10000) / 100 + "%";
}

exports.showComparison = (label, indices, dieSides) => {
    let bits = [`${label}:`];
    let sumOdds = 0;
    let minOdds = 1;

    for (let i = 0; i < indices.length; i += 1) {
        const index = indices[i];
        const nextIndex = indices[i < indices.length - 1 ? i + 1 : 0];
        const odds = compareRolls(dieSides[index], dieSides[nextIndex]);
        sumOdds += odds;
        minOdds = Math.min(minOdds, odds);
        const percent = roundPercent(odds);
        bits.push(`[${index}] ${dieSides[index].join(",")} ${percent}`);
    }

    const avgPct = roundPercent(sumOdds / indices.length);
    const minPct = roundPercent(minOdds);
    bits.push(`= avg ${avgPct} min ${minPct}`);
    console.log(bits.join(" "));
};

exports.showDoubledComparison = (label, indices, dieSides, doubledRolls) => {
    let bits = [`${label}:`];
    let sumOdds = 0;
    let minOdds = 1;

    for (let i = 0; i < indices.length; i += 1) {
        const index = indices[i];
        const prevIndex = indices[i ? i - 1 : indices.length - 1];
        const odds = compareDoubledRolls(doubledRolls[index], doubledRolls[prevIndex]);
        sumOdds += odds;
        minOdds = Math.min(minOdds, odds);
        const percent = roundPercent(odds);
        bits.push(`[${index}] ${dieSides[index].join(",")} ${percent}`);
    }

    const avgPct = roundPercent(sumOdds / indices.length);
    const minPct = roundPercent(minOdds);
    bits.push(`= avg ${avgPct} min ${minPct}`);
    console.log(bits.join(" "));
};

exports.filterMinimumThreshold = (
    startingIndex,
    thresholdPct,
    dieSides,
    dieVsDie,
    doubledRolls
) => {
    let loopAgain = true;
    let filterPass = 0;
    console.log("Current set size:", dieSides.length);
    console.log("Eliminating below minimum threshold:", thresholdPct);

    while (loopAgain) {
        loopAgain = false;
        filterPass += 1;

        for (let a = startingIndex; a < dieSides.length; ) {
            const max = Math.max(...dieVsDie[a]);

            if (max >= thresholdPct) {
                a += 1;
            } else {
                dieSides.splice(a, 1);

                if (doubledRolls) {
                    doubledRolls.splice(a, 1);
                }

                for (let x = startingIndex; x < dieVsDie.length; x += 1) {
                    dieVsDie[x].splice(a, 1);
                }

                dieVsDie.splice(a, 1);
                loopAgain = true;
            }

            status.show(`Pass ${filterPass}: ${a} / ${dieSides.length}`);
        }

        status.clear();
    }

    console.log("Total filtering passes:", filterPass);
    console.log("Current filtered set size:", dieSides.length);
};
