const d = new Date();

const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

const dd = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
const dm = d.getMonth() + 1 < 10 ? `0${(d.getMonth() + 1)}` : d.getMonth() + 1;
const dy = d.getFullYear() % 100 < 10 ? `0${d.getFullYear() % 100}` : d.getFullYear() % 100;
const dh = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
const dmn = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
const dw = days[d.getDay()];

const date = `${dd}.${dm}.${dy}`;
const time = `${dh}:${dmn}`;
const day = dw;
const year = d.getFullYear();

const now = {
    date,
    time,
    day,
    year
};

const stringToDate = str => {
    const parts = str.split('-');

    return new Date(parts[0], parts[1] - 1, parts[2]);
};

module.exports = {
    now,
    stringToDate
};