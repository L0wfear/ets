let twoDigits = (n) => n < 10 ? '0'+n : n;

export function makeDate (date) {
  return date.getFullYear()+'-'+twoDigits(date.getMonth()+1)+'-'+twoDigits(date.getDate())
}

export function makeTime (date, withSeconds = false) {
  return twoDigits(date.getHours())+':'+twoDigits(date.getMinutes())+( withSeconds ? ':'+twoDigits(date.getSeconds()) : '')
}
