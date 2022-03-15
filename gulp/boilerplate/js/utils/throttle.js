export default function(func, timeout = 200) {
    let isThrottled = false;
    let savedArgs;
    let savedThis;

    const wrapper = function() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;

            return;
        };

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout(function() {
            isThrottled = false;

            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);

                savedArgs = savedThis = null;
            };
        }, timeout);
    };

    return wrapper;
};