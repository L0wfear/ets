# Руководство разработчика

[Работа с проектом в целом](## Работа с проектом в целом)

[Работа со статикой](## Работа со статикой)

## Работа с проектом в целом

### Стиль написания кода

Для написания кода следует строго придерживаться определенных ниже Стилей написания кода (`Style Guide`).

Использутся следующие стили:

`Javascript`:

[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

`React`:

[Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

Соответствия стилю проверяются с помощью `eslint`.

Конфигурация `eslint` хранится в файле `.eslintrc.js`.

Запуск проверки с помощью `eslint` осуществляется с помощью команды

`npm run lint`

### Версионирование проекта

Версия проекта эквивалентна версии `package.json` и должна соответствовать стандарту [Semver 2.0](http://semver.org/).

`major` часть версии проставляется в соответствии с финальными релизами

`minor` часть версии проставляется после каждой итерации/спринта/etc

`patch` часть версии инкрементируется с каждым изменением приложения

Для обеспечения стабильной инкрементации `patch` части версии используется `git-hook` `pre-commit`, который увеличивает версию в `package.json` с каждым коммитом.


## Работа со статикой

Статические файлы находятся в `src/assets`.

### Стили

Стили создаются в `src/assets`  и `src/assets/styles`.

Для определения стилей используется препроцессор `Sass`.
Рекомендуется использовать `.scss` файлы.

Включать стили в приложения нужно в `js` с помощью ES6 Modules.

Доступно подключение только `.scss` файлов. Для использования `.css` можно либо переименовать файл, либо импортировать его в существующий `.scss` файл.

__Пример включения стиля в js:__

```
// src/index.js
import './assets/main.scss';
```

### Шрифты

Шрифты создаются в `src/assets/fonts`.

Для работы со шрифтами из `scss` указывается относительный путь.

__Пример включения шрифта в scss:__

```
// src/assets/somefile.scss
@font-face {
  font-family: 'RwWidgets';
  src: url('fonts/rw-widgets.eot?v=4.1.0');
  src: url('fonts/rw-widgets.eot?#iefix&v=4.1.0') format('embedded-opentype'), url('fonts/rw-widgets.woff?v=4.1.0') format('woff'), url('fonts/rw-widgets.ttf?v=4.1.0') format('truetype'), url('fonts/rw-widgets.svg?v=4.1.0#fontawesomeregular') format('svg');
  font-weight: normal;
  font-style: normal
}
```

### Изображения

Изображения создаются в `src/assets/images`.

Для работы с изображениями из `scss` указывается относительный путь.

__Пример включения изображения в scss:__

```
// src/assets/main.scss
.class {
  background-image: url('images/icon2.png');
}
```

Для работы с изображениями из `js` используется ES6 Modules.

__Пример включения изображения в js:__

```
import defaultUser from '../assets/images/avatar-default.png';

...

render() {
  return <img role="presentation" src={defaultUser}/>;
}

```
