import randomNumber from './number';

const randomIndex = (min = 0, max = 100, exclude = []) => {
    const num = randomNumber(min, max);

    return (exclude.includes(num)) ? randomIndex(min, max) : num;
};

export default randomIndex;