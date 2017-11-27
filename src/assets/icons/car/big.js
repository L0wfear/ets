const icons = {};
const iconCache = {};
const DEVICE_PIXEL_RATIO = window.devicePixelRatio;
const ICON_MAP = {
  9: 'podmetalka',
  1: 'polivalka',
  2: 'samosval',
  4: 'pogruzchik',
  5: 'pogruzchik',
  6: 'reagent',
  7: 'reagent_tverd',
  8: 'trotuar',
  11: 'greider',
  13: 'musorovoz',
  16: 'traktor',
  18: 'musorovoz',
  19: 'musorovoz',
  20: 'musorovoz',
  21: 'musorovoz',
  22: 'musorovoz',
  23: 'musorovoz',
  1000: 'neizvesten',
};

export default function getMapIcon(name = 'drugoe', zoom = 1) {
  if (ICON_MAP[name]) {
    name = ICON_MAP[name];
  }
  // console.log('----big.js---name', name); // 'drugoe' для всех типов ТС
  let cached = true;

 // console.log('----big.js---typeof icons[name]', typeof icons[name]);
  if (typeof icons[name] === 'undefined') {
    name = 'drugoe';
  }

  // console.log('----big.js---typeof iconCache[name]', typeof iconCache[name]);
  if (typeof iconCache[name] === 'undefined') {
    iconCache[name] = [];
    cached = false;
  } else if (typeof iconCache[name][zoom] === 'undefined') {
    cached = false;
  }

  if (!cached) {
    const line = 20 * DEVICE_PIXEL_RATIO * zoom;
   // console.log('----big.js--line', line);
    const canvas = document.createElement('canvas');
    // console.log('----big.js--canvas', canvas);
    canvas.width = canvas.height = line;
    const ctx = canvas.getContext('2d');

    const temp_ctx = icons[name];
   // console.log('----big.js--icons', icons);
   // console.log('----big.js--temp_ctx', temp_ctx); // разметка img
    ctx.drawImage(temp_ctx, 0, 0, line, line);
   // console.log('----big.js--ctx', ctx); // CanvasRenderingContext2D {...}

    iconCache[name][zoom] = canvas;
    return canvas;
  }
 // console.log('----big.js--iconCache[name][zoom]', iconCache[name][zoom]);
  return iconCache[name][zoom];
}

export function getIcon(id) {
  console.log('----big.js----id', id);
  const icon = ICON_MAP[id] || 'drugoe';
  console.log('----big.js----icon', icon);
  console.log('----big.js----icons[icon]', icons[icon]);
  return icons[icon];
}

function loadIcon(name, data) {
  // console.log('----big.js----name, data', name, data); // name - это trotuar, data - ссылка на тратуар data:images/[name].[ext];base64,
  const img = new Image();
  // console.log('----big.js-- img', img); // разметка HTML тэга img
  img.onload = function setName(...arg) {
    icons[name] = img;
 // console.log('----big.js-- icons', icons); // объект {...,drugoe: img,...}
  };
  img.src = data;
  // console.log('----big.js-- img.src', img.src); // ссылка на картинку !!!
}

// webpack-dev-server и url-loader не дружат с svg
// Если это тут, то проблема не решена
if (__DEVELOPMENT__) {
  loadIcon('greider', require('./greider.png'));
  loadIcon('musorovoz', require('./musorovoz.png'));
  loadIcon('podmetalka', require('./podmetalka.png'));
  loadIcon('pogruzchik', require('./pogruzchik.png'));
  loadIcon('polivalka', require('./polivalka.png'));
  loadIcon('reagent', require('./reagent.png'));
  loadIcon('reagent_tverd', require('./reagent_tverd.png'));
  loadIcon('samosval', require('./samosval.png'));
  loadIcon('traktor', require('./traktor.png'));
  loadIcon('trotuar', require('./trotuar.png'));
  loadIcon('drugoe', require('./drugoe.png'));
  loadIcon('neizvesten', require('./neizvesten.png'));
} else {
  loadIcon('greider', require('./greider.svg'));
  loadIcon('musorovoz', require('./musorovoz.svg'));
  loadIcon('podmetalka', require('./podmetalka.svg'));
  loadIcon('pogruzchik', require('./pogruzchik.svg'));
  loadIcon('polivalka', require('./polivalka.svg'));
  loadIcon('reagent', require('./reagent.svg'));
  loadIcon('reagent_tverd', require('./reagent_tverd.svg'));
  loadIcon('samosval', require('./samosval.svg'));
  loadIcon('traktor', require('./traktor.svg'));
  loadIcon('trotuar', require('./trotuar.svg'));
  loadIcon('drugoe', require('./drugoe.svg'));
  loadIcon('neizvesten', require('./neizvesten.svg'));
}

