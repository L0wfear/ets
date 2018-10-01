/**
 * APP ENTRY FILE
 * Стартовый файл приложения
 * @module ets
 */
/* 3rd party js */
import './assets/main.scss';

/* Старт приложения */
import './bootstrap';
/* Вспомогательные утилиты,
 * требующие постоянного нахождения в специфичном элементе в DOM
 */
import './components/ui/NotificationSystem';
import './components/ui/Prompt';
import './config/raven';
