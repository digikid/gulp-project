const { name } = add('@/package.json');

module.exports = {
    main: {
        css: 'Таблица стилей CSS',
        js: 'Файл JavaScript',
    },
    zip: {
        [`${name}-src`]: 'Архив с исходными файлами',
        [`${name}-dist`]: 'Архив с версткой',
    },
    html: {
        untitled: 'Новая страница',
        index: 'Главная страница',
        catalog: 'Каталог',
        404: 'Страница не найдена'
    }
};