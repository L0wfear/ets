/**
 * Вспомогательные функции
 * @module utils/functions
 */

export function isNotNull(value) {
  return typeof value !== 'undefined' && value !== null;
}

/**
 * Проверяет значение на "пустоту"
 * "Пустым" считается значение undefined, null и пустая строка
 * @example
 * // true
 * isEmpty('');
 * @example
 * // true
 * isEmpty({}.a)
 * @example
 * // true
 * isEmpty(null)
 * @return {boolean} isEmpty - пyстое ли значение
 */
export function isEmpty(value) {
  if (!isNotNull(value)) return true;
  if (typeof value === 'string' && value.length === 0) return true;
  return false;
}

export function saveData(blob, fileName) {

  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  if (fileName) {
    a.download = fileName;
  }
  a.click();
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
}

export function printData(blob) {
  console.log(blob);
  let url = window.URL.createObjectURL(new Blob([blob], {type:'application/pdf'}));
  let iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  iframe.style = "display: none";
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
  if (carStateNumber && carStateNumber[0]) {
    return isNaN(carStateNumber[0]);
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
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 'rgba('
  + parseInt(result[1], 16) + ','
  + parseInt(result[2], 16) + ','
  + parseInt(result[3], 16) + ','
  + opacity + ')' : null
}
