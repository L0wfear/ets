/**
 * Вспомогательные функции
 * @module utils/functions
 */

import { isPlainObject, every, includes } from 'lodash';

/**
 * Example
 * isFourDigitGovNumberRegexp.text(valString);
 * Discription
 * Если в номере есть 4 числа, то ест одометр
 * DITETSSUP-347 (1 пункт)
 */
export const isFourDigitGovNumberRegexp = /\d{4}/;

/**
 * Example:
 * const a = 1, b = 2, c = 3;
 * a === 1 || b === 1 || c === 1 // true
 * isEqualOr([1, 2, 3], 1) // true
 */
export const isEqualOr = (values = [], matchValue) =>
  includes(values, matchValue);

/**
 * Example:
 * a === 1 && b === 1 && c === 1 // false
 * isEqualAnd([1, 2, 3], 1) // false
 */
export const isEqualAnd = (values = [], matchValue) =>
  every(values, matchValue);
/**
 * Example:
 * a !== 1 || b !== 1 || c !== 1 // true
 * isNotEqualOr([1, 2, 3], 1) // true
 */
export const isNotEqualOr = (values = [], matchValue) =>
  !isEqualAnd(values, matchValue);
/**
 * Example:
 * a !== 1 && b !== 1 && c !== 1 // false
 * isNotEqualAnd([1, 2, 3], 1) // false
 */
export const isNotEqualAnd = (values = [], matchValue) =>
  !isEqualOr(values, matchValue);

/**
 * Стандартная проверка на null/undefined в js
 * @param {any} value
 * @return {boolean}
 */
export function isNotNull(value) {
  return typeof value !== 'undefined' && value !== null;
}

/**
 * Проверяет значение на "пустоту"
 * "Пустым" считается значение undefined, null и пустая строка
 * @param {any} value
 * @example
 * // true
 * isEmpty('');
 * @example
 * // true
 * isEmpty({}.a)
 * @example
 * // true
 * isEmpty(null)
 * @return {boolean} пyстое ли значение
 */
export function isEmpty(value) {
  if (!isNotNull(value)) {
    return true;
  }
  if (typeof value === 'string' && value.length === 0) {
    return true;
  }
  return false;
}

export function saveData(blob, fileName) {
  if (blob === null || fileName === null) {
    return;
  }
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, fileName || 'Отчет.xls');
  } else {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.classList.add('none');
    a.href = url;
    a.download = fileName || 'Отчет.xls';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }
}

function get_browser() {
  const ua = navigator.userAgent;
  let tem;
  let M =
    ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
    [];

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'IE',
      version: tem[1] || '',
    };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem !== null) {
      return {
        name: 'Opera',
        version: tem[1],
      };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  tem = ua.match(/version\/(\d+)/i);

  if (tem !== null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1],
  };
}

/**
 * [printData description]
 * @param  {[type]} blob [description]
 */
export function printData(blob) {
  const url = window.URL.createObjectURL(
    new Blob([blob], { type: 'application/pdf' }),
  );
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  iframe.classList.add('none');
  iframe.src = url;
  if (get_browser().name === 'Firefox') {
    setTimeout(() => {
      iframe.focus();
      iframe.contentWindow.print();
      window.URL.revokeObjectURL(url);
    }, 0);
  } else {
    iframe.onload = () => {
      iframe.focus();
      iframe.contentWindow.print();
      window.URL.revokeObjectURL(url);
    };
  }
}

/**
 * DITETS-2173 - описание в комментариях
 * Проверяет наличие "Счетчика моточасов" у ТС по гос.номеру
 * если в гос. номер есть 4 числа - "Счетчик моточасов" присутствует
 * @param {string} carStateNumber - гос.номер
 * @return {boolean} hasMotohours - есть ли "Счетчик моточасов"
 */
export function hasMotohours(carStateNumber) {
  if (carStateNumber) {
    return isFourDigitGovNumberRegexp.test(carStateNumber);
  }
  return null;
}

/**
 * преобразовывает hex цвет в rgba с нужной прозрачностью
 * @param hex
 * @param opacity
 * @return {*}
 */
export function hexToRgba(hex, opacity) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    return null;
  }

  const red = parseInt(result[1], 16);
  const green = parseInt(result[2], 16);
  const blue = parseInt(result[3], 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export function resizeBase64(base64) {
  return new Promise((res) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      res(canvas.toDataURL('image/png'));
    };
    image.src = base64;
  });
}

/**
 * Flattens object shallow
 * @param {object} inputObject
 */
export function flattenObject(inputObject) {
  const f = {};

  Object.keys(inputObject).forEach((k) => {
    if (isPlainObject(inputObject[k].value)) {
      Object.keys(inputObject[k].value).forEach((key) => {
        f[key] = { ...f[key] };
        f[key].value = inputObject[k].value[key];
      });
    } else {
      f[k] = inputObject[k];
    }
  });

  return f;
}

export const kbToBytes = (count = 1) => count * Math.pow(1024, 1);
export const mbToBytes = (count = 1) => count * Math.pow(1024, 2);
export const gbToBytes = (count = 1) => count * Math.pow(1024, 3);

export function fromIterableListToArray(itetableList) {
  const array = [];
  for (const item of itetableList) {
    array.push(item);
  }

  return array;
}

export const isFourDigitGovNumber = (number) =>
  isFourDigitGovNumberRegexp.test(number);

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
export function detectIE() {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  const edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}
