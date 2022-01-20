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

module.exports = {
    sortByKey,
    findByValue
};