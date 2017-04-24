/**
 * APP ENTRY FILE
 * Стартовый файл приложения
 * @module ets
 */
/* Полифиллы для поддержки старых браузеров */
import 'babel-polyfill';
import 'whatwg-fetch';
// require('babel-core/register');
/* 3rd party js */
import '!script!openlayers/dist/ol.js';
import 'ol3-popup/src/ol3-popup.js';
import './assets/main.scss';
/* Старт приложения */
import './bootstrap';
/* Вспомогательные утилиты,
 * требующие постоянного нахождения в специфичном элементе в DOM
 */
import './components/ui/NotificationSystem';
import './components/ui/Prompt';
import './config/raven.js';
