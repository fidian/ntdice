let lastStatus = null;
const statusDelay = 100; // ms

exports.clear = function clear() {
    lastStatus = null;
    process.stdout.write('\x1b[M');
};

exports.show = function status(message) {
    const now = Date.now();

    if (!lastStatus || lastStatus + statusDelay < now) {
        exports.clear();
        process.stdout.write(message);
        lastStatus = now;
    }
}
