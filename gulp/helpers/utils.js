const isObject = obj => obj != null && typeof obj === `object`;

const mergeDeep = (target, ...sources) => {
    if (!sources.length) {
        return target;
    };

    const source = sources.shift();

    function isObject(item) {
        return (item && typeof item === `object` && !Array.isArray(item));
    };

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {
                    [key]: {}
                });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            };
        };
    };

    return mergeDeep(target, ...sources);
};

const deepEqual = (obj1, obj2) => {
    if (typeof obj1 !== typeof obj2 !== `object`) {
        return false;
    };

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    };

    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) {
            return false;
        };
    };

    return true;
};

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

module.exports.isObject = isObject;
module.exports.mergeDeep = mergeDeep;
module.exports.deepEqual = deepEqual;
module.exports.capitalize = capitalize;