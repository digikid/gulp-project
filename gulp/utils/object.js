const isObject = obj => obj != null && typeof obj === 'object' && !Array.isArray(obj);

const cloneDeep = obj => JSON.parse(JSON.stringify(obj));

const mergeDeep = (...objs) => {
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

const findDeep = (obj, cb) => {
    const keys = Object.keys(obj) || [];

    let result = [];

    if (cb(obj)) {
        result = [...result, obj];
    };

    for (let i = 0; i < keys.length; i++) {
        let value = obj[keys[i]];

        if (typeof value === 'object' && value != null) {
            let o = findDeep(value, cb);

            if (o != null && o instanceof Array) {
                result = [...result, ...o];
            };
        };
    };

    return result;
};

const setDeep = (obj, key, value) => Object.keys(obj[key]).forEach(item => obj[key][item] = value);

module.exports = {
    isObject,
    cloneDeep,
    mergeDeep,
    findDeep,
    setDeep
};