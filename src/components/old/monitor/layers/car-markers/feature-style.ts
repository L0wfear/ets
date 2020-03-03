import { listObj } from 'constants/statuses';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Circle from 'ol/style/Circle';

const DEVICE_PIXEL_RATIO = 2; // window.devicePixelRatio;
const widthIcon = {
  zoomMore8: 25 / (DEVICE_PIXEL_RATIO / 2),
  zoomNotMore8: 14 / (DEVICE_PIXEL_RATIO / 2),
  minZoom: 11 / (DEVICE_PIXEL_RATIO / 2),
};

// let textPadding = 6 * DEVICE_PIXEL_RATIO;
const getRaidus = (width) => width / 2;

/*
const greider = require('assets/icons/car/greider.svg');
const musorovoz = require('assets/icons/car/musorovoz.svg');
const podmetalka = require('assets/icons/car/podmetalka.svg');
const pogruzchik = require('assets/icons/car/pogruzchik.svg');
const polivalka = require('assets/icons/car/polivalka.svg');
const reagent = require('assets/icons/car/reagent.svg');
const reagent_tverd = require('assets/icons/car/reagent_tverd.svg');
const samosval = require('assets/icons/car/samosval.svg');
const traktor = require('assets/icons/car/traktor.svg');
const trotuar = require('assets/icons/car/trotuar.svg');
const neizvesten = require('assets/icons/car/neizvesten.svg');

const images = {
  greider,
  musorovoz,
  podmetalka,
  pogruzchik,
  polivalka,
  reagent,
  reagent_tverd,
  traktor,
  samosval,
  trotuar,
  neizvesten,
  drugoe,
};

*/
const drugoe = require('assets/icons/car/drugoe.svg');

const images = {
  drugoe,
};

const icons: any = {};

Object.entries(images).forEach(([name, src]) => {
  const img = new Image();
  img.onload = () => {
    icons[name] = img;
  };
  img.src = src;
});

const CACHE_ICON: Record<string, Style> = {};

const getCanvasWH = (width, ctx, show_gov_number, gov_number, checkZoomSelect) => {
  let canvasWidth = width + 4;
  let canvasHeight = width + 4;

  if (show_gov_number && gov_number) {
    ctx.font = `${(checkZoomSelect ? 5 : 5) * 4 / DEVICE_PIXEL_RATIO}px Verdana`;
    canvasHeight = canvasWidth = Math.max(canvasWidth, 2.5 * ctx.measureText(gov_number).width + 4 * getRaidus(width));
  }
  if (checkZoomSelect) {
    canvasWidth = Math.max(canvasWidth, Math.sqrt(2) * width + 4);
    canvasHeight = Math.max(canvasHeight, Math.sqrt(2) * width + 4);
  }

  return [canvasWidth, canvasHeight];
};

const drawGovNumber = (canvas, ctx, width, status, show_gov_number, gov_number, directionInRad, selected, zoomMore8) => {
  if (show_gov_number && gov_number) {
    const directionToRight = directionInRad > 3 / 2 * Math.PI || directionInRad < 1 / 2 * Math.PI;

    const begCoord = {
      rect: !directionToRight ? canvas.width / 2 : 2,
      gov_number: !directionToRight ? canvas.width / 2 + 1.25  * getRaidus(width) : 3 / 4 * getRaidus(width),
    };
    const selectedRate = selected || zoomMore8 ? 1 : 1.7;
    ctx.beginPath();
    ctx.rect(begCoord.rect, (canvas.height / 2 - getRaidus(width) * selectedRate), canvas.width / 2 + 2, getRaidus(width) * 2 * selectedRate); // изменение размера четырёхугольника
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = selected ? listObj[status].color : 'black';
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = `${(zoomMore8 || selected ? 5 : 6) * 4 / DEVICE_PIXEL_RATIO}px Verdana`;
    ctx.textBaseline = 'middle';
    ctx.fillText(
      gov_number,
      begCoord.gov_number,
      (canvas.height / 2),
    );
    ctx.closePath();
  }
};

const drawCarMarker = (canvas, ctx, width, status, zoomMore8, selected, directionInRad, minZoom) => {
  ctx.beginPath();

  if ((zoomMore8 || selected)) {
    ctx.arc(
      (canvas.width) / 2,
      (canvas.width) / 2,
      getRaidus(width - 4),
      directionInRad + (1 / 4) * Math.PI, directionInRad - (1 / 4) * Math.PI,
      false,
    );
    const lineToZero = {
      x: Math.sqrt(2) * getRaidus(width),
      y: 0,
    };

    ctx.lineTo(
      lineToZero.x * Math.cos(directionInRad) - lineToZero.y * Math.sin(directionInRad) + (canvas.width) / 2,
      lineToZero.x * Math.sin(directionInRad) + lineToZero.y * Math.cos(directionInRad) + (canvas.width) / 2,
    );
  } else {
    ctx.arc(
      (canvas.width) / 2,
      (canvas.width) / 2,
      getRaidus(width),
      0,
      2 * Math.PI,
      false,
    );
  }
  ctx.closePath();

  ctx.fillStyle = listObj[status].color;
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = !selected ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)';
  ctx.stroke();
};

const drawCarIcon = (canvas, ctx, width, zoomMore8, selected) => {
  if (zoomMore8 || selected) {
    const temp_ctx = icons.drugoe;
    ctx.drawImage(temp_ctx, (canvas.width) / 2 - getRaidus(width) + 4, (canvas.width) / 2 - getRaidus(width) + 4, width - 8, width - 8);
  }
};

const makeCacheIcon = (cacheStyleName, { status, direction, selected, zoomMore8, gov_number, show_gov_number, minZoom }) => {
  const width = widthIcon[selected || zoomMore8 ? 'zoomMore8' : minZoom ? 'minZoom' : 'zoomNotMore8'];

  const directionInRad = (2 * Math.PI) / 360 * ( Math.abs((360 + (Number(direction) - 90) % 360) % 360) );

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  [canvas.width, canvas.height] = getCanvasWH(width, ctx, show_gov_number, gov_number, zoomMore8 || selected);

  drawGovNumber(canvas, ctx, width, status, show_gov_number, gov_number, directionInRad, selected, zoomMore8);
  drawCarMarker(canvas, ctx, width, status, zoomMore8, selected, directionInRad, minZoom);
  drawCarIcon(canvas, ctx, width, zoomMore8, selected);

  return CACHE_ICON[cacheStyleName] = new Style({
    image: new Icon({
      src: undefined,
      img: canvas,
      imgSize: [canvas.width, canvas.height],
    }),
    zIndex: selected ? Infinity : 10,
  });

  /*
  @todo try it
  const canvas = document.createElement('canvas');
  const widthIcon = 100;
  const heightIcon = 20;

  const render = toContext(
    canvas.getContext('2d'),
    {size: [widthIcon, heightIcon]},
  );
  render.setFillStrokeStyle(
      new Fill({ color: listObj[status].color }),
      new Stroke({ color: !selected ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)' }),
  );
  if (show_gov_number) {
    render.setTextStyle(
      new Text({
        font: '6px Verdana',
        text: gov_number,
        fill: new Fill({ color: 'black' }),
        backgroundFill: new Fill({ color: '#e26240' }),
        backgroundStroke: new Stroke({ color: 'blue', width: 2 }),
      }),
    );
  }

  const widthCircle = widthIcon[selected || zoomMore8 ? 'zoomMore8' : minZoom ? 'minZoom' : 'zoomNotMore8'] / 2 + 1;
  render.drawCircle(
    new CircleGeom(
      [widthIcon / 2, heightIcon / 2],
      (widthCircle - 1) / 2,
    ),
  );

  // render.drawPolygon(new Polygon(
  //     [[[0, 0], [0, width], [width, width], [width, width / 2]]],
  // ));

  CACHE_ICON[cacheStyleName] = new Style({
    image: new Icon({
      img: canvas,
      imgSize: [canvas.width, canvas.height],
    }),
  });

  return CACHE_ICON[cacheStyleName]
  */
};

export const getStyleForStatusDirectionType = ({ status, direction, selected, zoomMore8, gov_number, show_gov_number, visible, minZoom }) => {
  if (visible || selected) {
    const trueDirection = selected || zoomMore8 ? direction : 0;

    const cacheStyleName = `${status}/${selected}/${zoomMore8}/${minZoom}/${trueDirection}/${show_gov_number ? gov_number : null}`;
    const { [cacheStyleName] : cache_icon } = CACHE_ICON;
    let icon = cache_icon;

    if (!cache_icon) {
      icon = makeCacheIcon(
        cacheStyleName,
        { status, direction: trueDirection, selected, zoomMore8, gov_number, show_gov_number, minZoom },
      );
    }

    return icon;
  } else {
    const not_visible = 'not_visible';
    if (!CACHE_ICON[not_visible]) {
      return CACHE_ICON[not_visible] = new Style({
        image: new Circle({
          radius: 0,
        }),
      });
    } else {
      return CACHE_ICON[not_visible];
    }
  }
};
