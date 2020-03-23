module.exports = (() => {
    const days = [`воскресенье`, `понедельник`, `вторник`, `среда`, `четверг`, `пятница`, `суббота`];
    const date = new Date();
    const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const dm = date.getMonth() + 1 < 10 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;
    const dy = date.getFullYear() % 100 < 10 ? `0${date.getFullYear() % 100}` : date.getFullYear() % 100;
    const dh = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const dmn = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const dw = days[date.getDay()];

    return {
        date: `${dd}.${dm}.${dy}`,
        time: `${dh}:${dmn}`,
        day: dw,
        year: date.getFullYear()
    };
})();