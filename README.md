# ETS-Frontend

Структура проекта реализована на основе gost-react-frontend-boilerplate.

Файловая структура:

```
project
│    README.md     - этот файл
│    .babelrc      - конфигурация babel
│    .eslintrc.js  - конфигурация eslint
│    .eslintingore - исключения для eslint
│    .jsbeautifyrc - конфигурация jsbeautify
│    .editorconfig - конфигурация editorconfig
│    index.html    - html для сервера разработки
│    package.json  - package.json
│    server.js     - скрипт для запуска статического сервера   
│
└─── src - основные исходники проекта
│    └─── @types          - глобальные типы
│    └─── actions         - flummox actions (legacy)
│    └─── api             - средства работы с Back-end API
│    └─── assets          - статика (css, шрифты, картнки) (legacy)
│    └─── components      - react-компоненты приложения
│    └─── config          - файлы конфигурации
│    └─── constants       - константы
│    └─── global-styled   - глобальные стили проекта
│    └─── models          - модели и дополнительные классы (legacy)
│    └─── redux-main      - конфигурация и вся бизнес-логика redux
│    └─── stores          - flummox stores (legacy)
│    └─── utils           - дополнительные утилиты/функции
│    └─── vendor          - 3rd-party js, которые невозможно подключить с помощью npm
│    │    config.js       - конфигурация клиентской части приложения
│    │    index.js        - стартовый файл приложения
└─── webpack
│    └─── templates             - handlebars шаблоны для генерации html файлов
│    └─── utils                 - дополнительные функции
│    │    alias.js              - webpack.resolve.alias
│    │    webpack.dev.js        - конфиг под разработку
│    │    webpack.prod.js       - конфиг под сборку
│__________________________________________________________
```

## Запуск приложения

### Development

`npm run dev` (подключение к development серверу (gost-group.com))

`npm run dev:gost_stage` (подключение к тестовому серверу (gost-group.com))

`npm run dev:ets_test` (подключение к серверу препрода (mos.ru))

`npm run dev:ets_hotfix` (подключение к серверу с хотфиксами (mos.ru))

`npm run dev:prod` (подключение к production-серверу (mos.ru))

## Сборка приложения

Сборка приложения выполняется командами:

`npm run build` (сборка версии приложения для подключения к development серверу (gost-group.com))

`npm run build:gost_stage` (сборка версии приложения для подключения к тестовому серверу (gost-group.com))

`npm run build:ets_test` (сборка версии приложения для подключения к серверу препрода (mos.ru))

`npm run build:ets_hotfix` (сборка версии приложения для подключения к тк серверу с хотфиксами (mos.ru))

`npm run build:prod` (сборка версии приложения для подключения к production серверу (mos.ru))

Файлы сборки помещаются в папку `dist`.

Структура папки `dist`:

```
dist
└─── css - папка со стилями
│    app.css - стили приложения
└─── fonts - папка со всеми шрифтами приложения
└─── images - папка со всеми картинками приложения
│    app.[chankname].[chankhash].js - основной файл приложения, [hash] - уникальный идентификатор сборки
│    index.html - файл, содержащий в себе весь необходимый html код для работы приложения
```

Для обеспечения работы приложения необходим статический сервер, который на все url будет отдавать `index.html` из папки `dist`, а так же будет отдавать всю статику из папки `dist`.

## Дополнительная информация

[Руководство разработчика](/docs/DEV.md)

[Технологическое обеспечение проекта](/docs/TECH_SPECS.md)
