let twoDigits = (n) => n < 10 ? '0'+n : n;

export function makeDate (date) {
  return date.getFullYear()+'-'+twoDigits(date.getMonth()+1)+'-'+twoDigits(date.getDate())
}

export function makeTime (date, withSeconds = false) {
  return twoDigits(date.getHours())+':'+twoDigits(date.getMinutes())+( withSeconds ? ':'+twoDigits(date.getSeconds()) : '')
}


// TODO move CONSTS to settings store
export const TRACK_COLORS = {
  green: '#6c0',
  greenyellow: '#cf3',
  yellow: '#ff3',
  red: '#f03',
  stop: '#005',
  point_border: '#777'
};

export function isPMPSHfn ( type_id ){
  return type_id === 1 || type_id === 6 || type_id === 7 || type_id === 10;
}
/**
 * получение цвета линии трэка
 * в зависимости от скорости
 * @param speed
 * @returns color string
 */
export function getTrackColor (speed, type_id, opacity = 1) {
  /*

   0-10кмч - зеленый
   10-20кмч - зелено-желтый
   20-30кмч - красный для машин ПМ,ПЩ,РЖР,РТР, для других зелено-желтый
   30-40кмч - красный для машин ПМ,ПЩ,РЖР,РТР, для других желтый
   40+кмч - красный

   ПМ "title": "Поливомоечная техника", "id": 1
   ПЩ "title": "Плужно-щеточная техника","id": 10
   РЖР "title": "Распределитель жидких реагентов", "id": 6
   РТР "title": "Распределитель твердых реагентов", "id": 7
   */

  let isPMPSH = isPMPSHfn(type_id);
  let result = TRACK_COLORS.green; // green by default

  /**
   * преобразовывает hex цвет в rgba с нужной прозрачностью
   * @param hex
   * @param opacity
   * @returns {*}
   */
  function hexToRgba(hex, opacity) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 'rgba('
    + parseInt(result[1], 16) + ','
    + parseInt(result[2], 16) + ','
    + parseInt(result[3], 16) + ','
    + opacity+')' : null
  }

  /* TODO STOP SIGN
   if ( speed === 0 ){
   return colors.stop
   }*/

  if ( speed >= 0 && speed < 10 ){
    result = TRACK_COLORS.green
  }

  if ( speed >= 10 && speed < 20  ) {
    result =  TRACK_COLORS.greenyellow
  }

  if ( speed >= 20 && speed < 30 ) {
    result =  isPMPSH ? TRACK_COLORS.red : TRACK_COLORS.greenyellow
  }

  if ( speed >= 30 && speed <= 40 ){
    result = isPMPSH ? TRACK_COLORS.red : TRACK_COLORS.yellow
  }

  if ( speed > 40 ) {
    result = TRACK_COLORS.red
  }

  return opacity === 1 ? result : hexToRgba( result, opacity);
}
