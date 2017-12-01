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
  let cached = true;

  if (typeof icons[name] === 'undefined') {
    name = 'drugoe';
  }

  if (typeof iconCache[name] === 'undefined') {
    iconCache[name] = [];
    cached = false;
  } else if (typeof iconCache[name][zoom] === 'undefined') {
    cached = false;
  }

  if (!cached) {
    const line = 20 * DEVICE_PIXEL_RATIO * zoom;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = line;
    const ctx = canvas.getContext('2d');

    const temp_ctx = icons[name];
    ctx.drawImage(temp_ctx, 0, 0, line, line);

    iconCache[name][zoom] = canvas;
    return canvas;
  }
  return iconCache[name][zoom];
}

export function getIcon(id) {
  const icon = ICON_MAP[id] || 'drugoe';
  return icons[icon];
}

function loadIcon(name, data) {
  const img = new Image();
  img.onload = function setName(...arg) {
    icons[name] = img;
  };
  img.src = data;
}

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

