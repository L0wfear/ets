/**
 * APP ENTRY FILE
 * Стартовый файл приложения
 * @module ets
 */
/* Полифиллы для поддержки старых браузеров */
require('babel/polyfill');
require('whatwg-fetch');
window.Object.assign = require('object-assign');
/* 3rd party js */
import '!script!openlayers/dist/ol.js';
import 'ol3-popup/src/ol3-popup.js';
/* 3rd party css */
// TODO переместить в dependencies.scss, добавив правильный лоадер
import '!style!raw!openlayers/dist/ol.css';
import '!style!raw!ol3-popup/src/ol3-popup.css';
import '!style!raw!../styles/bootstrap.min.css';
import '!style!raw!sass!../styles/main.scss';
import '!style!raw!react-select/dist/react-select.css';
/* Проставляем NODE_ENV для оптимизации работы некоторых библиотек */
global.NODE_ENV = process.env.NODE_ENV;
/* Глобальный формат даты для всех дейтпикеров и строк */
global.APP_DATE_FORMAT = 'DD.MM.YYYY';
/* Старт приложения */
import './components/App';
/* Вспомогательные утилиты,
 * требующие постоянного нахождения в специфичном элементе в DOM
 */
import './components/ui/NotificationSystem';
import './components/ui/Prompt';
