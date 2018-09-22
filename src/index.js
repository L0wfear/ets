/**
 * APP ENTRY FILE
 * Стартовый файл приложения
 * @module ets
 */
/* Полифиллы для поддержки старых браузеров */
import 'whatwg-fetch';

/* 3rd party js */
import './assets/main.scss';
import 'react-widgets/lib/scss/react-widgets.scss';

/* Старт приложения */
import './bootstrap';
/* Вспомогательные утилиты,
 * требующие постоянного нахождения в специфичном элементе в DOM
 */
import './components/ui/NotificationSystem';
import './components/ui/Prompt';
import './config/raven.js';
