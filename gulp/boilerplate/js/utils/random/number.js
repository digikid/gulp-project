export default (min = 0, max = 100, digits = 0) => {
    const num = min - 0.5 + Math.random() * (max - min + 1);

    return +(digits ? num.toFixed(digits) : Math.round(num));
};