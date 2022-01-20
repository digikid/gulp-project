export const preventEvent = e => {
    e = e || window.event;

    if (e.preventEvent) {
        e.preventEvent();
    };

    e.returnValue = false;
};

export const preventKeyEvent = (e, keys = []) => {
    if (keys.includes(e.keyCode)) {
        preventEvent(e);

        return false;
    };
};