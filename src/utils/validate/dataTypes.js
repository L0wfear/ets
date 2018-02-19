/**
 * Классическая функция из учебника, проверяющая, что у аргумента тип данные - число,
 * которая не делает "магии", то есть не пытается преобразовать аргумент в число.
 */
export function isNumeric(mustBeNumber) {
  return !isNaN(parseFloat(mustBeNumber)) && isFinite(mustBeNumber);
}
