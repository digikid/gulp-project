const { stringToDate } = add('@gulp/utils/date');

const sortByKey = (arr, key, reverse) => {
    const result = [...arr].sort((a, b) => {
        let valueA = +a[key] || 0;
        let valueB = +b[key] || 0;

        if (key === 'date') {
            valueA = stringToDate(a[key]);
            valueB = stringToDate(b[key]);
        };

        return valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
    });

    return reverse ? result.reverse() : result;
};

const findByValue = (arr, key, value = true) => arr.filter(item => item[key].toString() === value.toString());

const shuffle = arr => {
    const result = arr.concat();

    for (let i = (result.length - 1); i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = result[i];

        result[i] = result[j];
        result[j] = temp;
    };

    return result;
};

const paginate = (arr = [], start = 0, end = arr.length) => {
    return end > start ? [...arr].slice(start, end) : arr;
};

module.exports = {
    sortByKey,
    findByValue,
    shuffle,
    paginate
};