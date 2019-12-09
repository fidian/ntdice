exports.rollDie = function rollDie(min, max, cb) {
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

exports.compareDieRollStrings = function compareDieRollStrings(rolls1, rolls2) {
    const die1 = rolls1.split(' ');
    const die2 = rolls2.split(' ');
    let wins = 0;

    for (const one of die1) {
        for (const two of die2) {
            if (one > two) {
                wins += 1;
            }
        }
    }

    return wins / (die1.length * die2.length);
}

function roundPercent(n) {
    return Math.round(n * 10000) / 100 + '%';
}

exports.showComparison = function showComparison(label, indices, dieSides) {
    let bits = [`${label}:`];
    let sumOdds = 0;
    let minOdds = 1;

    for (let i = 0; i < indices.length; i += 1) {
        const index = indices[i];
        const nextIndex = indices[i < indices.length - 1 ? i + 1 : 0];
        const odds = exports.compareDieRollStrings(dieSides[index], dieSides[nextIndex]);
        sumOdds += odds;
        minOdds = Math.min(minOdds, odds);
        const percent = roundPercent(odds);
        bits.push(`[${index}] ${dieSides[index]} ${percent}`)
    }

    const avgPct = roundPercent(sumOdds / indices.length);
    const minPct = roundPercent(minOdds);
    bits.push(`= avg ${avgPct} min ${minPct}`);
    console.log(bits.join(' '));
}
