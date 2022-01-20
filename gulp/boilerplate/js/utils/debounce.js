export default function(func, timeout = 200) {
    if (!func) return;

    let timer;

    return function() {
        const scope = this;
        const args = arguments;

        clearTimeout(timer);

        timer = setTimeout(function() {
            func.apply(scope, Array.prototype.slice.call(args));
        }, timeout);
    };
};