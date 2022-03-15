export const id = () => {
    const chr4 = () => Math.random().toString(16).slice(-4);

    return chr4() + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + chr4() + chr4();
};

export const number = (min = 0, max = 100, digits = 0) => {
    const num = min - 0.5 + Math.random() * (max - min + 1);

    return +(digits ? num.toFixed(digits) : Math.round(num));
};

export const index = (min = 0, max = 100, exclude = []) => {
    const num = number(min, max);

    return (exclude.includes(num)) ? index(min, max) : num;
};