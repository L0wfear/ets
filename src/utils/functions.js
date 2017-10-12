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
const isFourDigitGovNumberRegexp = /\d{4}/;

/**
 * Example:
 * const a = 1, b = 2, c = 3;
 * a === 1 || b === 1 || c === 1 // true
 * isEqualOr([1, 2, 3], 1) // true
 */
export const isEqualOr = (values = [], matchValue) => includes(values, matchValue);

/**
 * Example:
 * a === 1 && b === 1 && c === 1 // false
 * isEqualAnd([1, 2, 3], 1) // false
 */
export const isEqualAnd = (values = [], matchValue) => every(values, matchValue);
/**
 * Example:
 * a !== 1 || b !== 1 || c !== 1 // true
 * isNotEqualOr([1, 2, 3], 1) // true
 */
export const isNotEqualOr = (values = [], matchValue) => !isEqualAnd(values, matchValue);
/**
 * Example:
 * a !== 1 && b !== 1 && c !== 1 // false
 * isNotEqualAnd([1, 2, 3], 1) // false
 */
export const isNotEqualAnd = (values = [], matchValue) => !isEqualOr(values, matchValue);

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
  if (!isNotNull(value)) return true;
  if (typeof value === 'string' && value.length === 0) return true;
  return false;
}

export function saveData(blob, fileName) {
  if (isEqualOr([blob, fileName], null)) return;

  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'Отчет.xls';
  if (fileName) {
    a.download = fileName;
  }
  a.click();
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
}

/**
 * [printData description]
 * @param  {[type]} blob [description]
 */
export function printData(blob) {
  const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  iframe.style = 'display: none';
  iframe.src = url;
  iframe.onload = () => {
    iframe.focus();
    iframe.contentWindow.print();
    window.URL.revokeObjectURL(url);
  };
}

/**
 * Проверяет наличие одометра у ТС по гос.номеру
 * если гос. номер начинается с буквы - одометр есть
 * @param {string} carStateNumber - гос.номер
 * @return {boolean} hasOdometer - есть ли одометр
 */
export function hasOdometer(carStateNumber) {
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
      canvas.width = image.width / window.devicePixelRatio;
      canvas.height = image.height / window.devicePixelRatio;
      ctx.drawImage(image,
        0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height
      );
      res(canvas.toDataURL('image/png', 0.7));
    };
    image.src = base64;
  });
}

export const isThreeDigitGovNumber = number => !isFourDigitGovNumberRegexp.test(number);
export const isFourDigitGovNumber = number => isFourDigitGovNumberRegexp.test(number);

/**
 * Flattens object shallow
 * @param {object} inputObject
 */
export function flattenObject(inputObject) {
  const f = {};
  Object.keys(inputObject).forEach((k) => {
    if (isPlainObject(inputObject[k])) {
      Object.keys(inputObject[k]).forEach(key => (f[key] = inputObject[k][key]));
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
