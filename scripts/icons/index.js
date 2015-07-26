var fs = require('fs');
var DOMURL = window.URL || window.webkitURL || window;
var icons = {};

function loadIcon(name, data) {

  return new Promise(function(resolve, reject) {

    var img = new Image();
    var svg = new Blob([data], { type: 'image/svg+xml' });
    var url = DOMURL.createObjectURL(svg);
    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 40;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 40, 40); // TODO retina + const
      icons[name] = canvas;
      icons[name].url = url;
      resolve(img);
    };
    img.src = url;

  });

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
  4: 'pogruzchik'
}

exports.getIcon = function getIcon(id) {
  const icon = ICON_MAP[id] || 'drugoe';
  return icons[icon];
}


exports.icons = icons;

exports.loadIcons = Promise.all([
  loadIcon('greider', fs.readFileSync(__dirname + '/greider.svg', 'utf8')),
  loadIcon('musorovoz', fs.readFileSync(__dirname + '/musorovoz.svg', 'utf8')),
  loadIcon('podmetalka', fs.readFileSync(__dirname + '/podmetalka.svg', 'utf8')),
  loadIcon('pogruzchik', fs.readFileSync(__dirname + '/pogruzchik.svg', 'utf8')),
  loadIcon('polivalka', fs.readFileSync(__dirname + '/polivalka.svg', 'utf8')),
  loadIcon('reagent', fs.readFileSync(__dirname + '/reagent.svg', 'utf8')),
  loadIcon('reagent_tverd', fs.readFileSync(__dirname + '/reagent_tverd.svg', 'utf8')),
  loadIcon('samosval', fs.readFileSync(__dirname + '/samosval.svg', 'utf8')),
  loadIcon('traktor', fs.readFileSync(__dirname + '/traktor.svg', 'utf8')),
  loadIcon('trotuar', fs.readFileSync(__dirname + '/trotuar.svg', 'utf8')),
  loadIcon('drugoe', fs.readFileSync(__dirname + '/drugoe.svg', 'utf8'))
]);
