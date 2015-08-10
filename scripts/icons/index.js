import fs from 'fs';

var DOMURL = window.URL || window.webkitURL || window;
var icons = {};

function loadIcon(name, data) {

  var img = new Image();

  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 40;
  var ctx = canvas.getContext('2d');

  img.onload = function () {
    ctx.drawImage(img, 0, 0, 40, 40); // TODO retina + const
    icons[name] = {
      canvas: canvas,
      src: data
    }
  }

  img.src = data;
}

const ICON_MAP = {
  16: 'traktor',
  11: 'greider',
  13: 'musorovoz',
  18: 'musorovoz',
  19: 'musorovoz',
  20: 'musorovoz',
  21: 'musorovoz',
  22: 'musorovoz',
  23: 'musorovoz',
  9: 'podmetalka',
  1: 'polivalka',
  6: 'reagent',
  7: 'reagent_tverd',
  2: 'samosval',
  5: 'pogruzchik',
  8: 'trotuar',
  4: 'pogruzchik',
  1000: 'neizvesten'
}

export function getIcon (id) {
  const icon = ICON_MAP[id] || 'drugoe';
  return icons[icon];
};

export default icons;

loadIcon('greider', require('./greider.svg')),
loadIcon('musorovoz', require('./musorovoz.svg')),
loadIcon('podmetalka', require('./podmetalka.svg')),
loadIcon('pogruzchik', require('./pogruzchik.svg')),
loadIcon('polivalka', require('./polivalka.svg')),
loadIcon('reagent', require('./reagent.svg')),
loadIcon('reagent_tverd', require('./reagent_tverd.svg')),
loadIcon('samosval', require('./samosval.svg')),
loadIcon('traktor', require('./traktor.svg')),
loadIcon('trotuar', require('./trotuar.svg')),
loadIcon('drugoe', require('./drugoe.svg')),
loadIcon('neizvesten', require('./neizvesten.svg'))
