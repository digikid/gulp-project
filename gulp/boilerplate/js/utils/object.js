export const isObject = obj => {
    if ((typeof(obj) !== 'object') || obj.nodeType || (obj !== null) && (obj !== undefined) && (obj === obj.window)) {
        return false;
    };

    if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    };

    return true;
};

export const isObjectEmpty = obj => (obj && isObject(obj) && !Object.keys(obj).length);

export const cloneDeep = obj => JSON.parse(JSON.stringify(obj));

export const mergeDeep = (...objs) => {
    let options;
    let name;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let i = 1;
    let length = objs.length;
    let target = objs[0] || {};
    let deep = true;

    if ((typeof target !== 'object') && (typeof target !== 'function')) {
        target = {};
    };

    if (i === length) {
        i--;
    };

    for (; i < length; i++) {
        if ((options = objs[i]) != null) {
            for (name in options) {
                copy = options[name];

                if ((name === '__proto__') || (target === copy)) {
                    continue;
                };

                if (deep && copy && (isObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    src = target[name];

                    if (copyIsArray && !Array.isArray(src)) {
                        clone = [];
                    } else if (!copyIsArray && !isObject(src)) {
                        clone = {};
                    } else {
                        clone = src;
                    };

                    copyIsArray = false;

                    target[name] = mergeDeep(clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                };
            };
        };
    };

    return target;
};