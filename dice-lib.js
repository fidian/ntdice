const status = require('./status');

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
    console.log('Tabulating distinct die configurations');

    rollDie(minValue, maxValue, die => {
        dieSides.push(die);
    });

    console.log('Possible combinations:', dieSides.length);

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
    console.log('Calculating odds');

    const dieSideVsSide = [];

    for (let a = 0; a < dieSides.length; a += 1) {
        status.show(`${a} / ${dieSides.length}`);
        dieSideVsSide[a] = [];

        for (let b = 0; b < dieSides.length; b += 1) {
            dieSideVsSide[a][b] = compareRolls(dieSides[a], dieSides[b]);
        }
    }

    status.clear();

    return dieSideVsSide;
}

function roundPercent(n) {
    return Math.round(n * 10000) / 100 + '%';
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
        bits.push(`[${index}] ${dieSides[index].join(',')} ${percent}`)
    }

    const avgPct = roundPercent(sumOdds / indices.length);
    const minPct = roundPercent(minOdds);
    bits.push(`= avg ${avgPct} min ${minPct}`);
    console.log(bits.join(' '));
}

exports.filterMinimumThreshold = (thresholdPct, dieSides, dieSideVsSide) => {
    let loopAgain = true;
    let filterPass = 0;
    console.log('Current set size:', dieSides.length);
    console.log('Eliminating below minimum threshold:', thresholdPct);

    while (loopAgain) {
        loopAgain = false;
        filterPass += 1;

        for (let a = 0; a < dieSides.length;) {
            const max = Math.max(...dieSideVsSide[a]);

            if (max >= thresholdPct) {
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

        status.clear();
    }

    console.log('Total filtering passes:', filterPass);
    console.log('Current filtered set size:', dieSides.length);
}
