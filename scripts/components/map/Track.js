import { projectToPixel } from './MskAdapter.js';
import { getTrack } from '../../adapter.js';
import { getStartOfToday } from '../../helpers/dates.js';
import { TRACK_COLORS, TRACK_LINE_OPACITY, TRACK_POINT_RADIUS, SHOW_ONLY_POINTS_WITH_SPEED_CHANGES } from '../../constants/track.js';
import { getTypeById } from '../../types.js';
import { getTrackPointByColor } from '../../icons/track/points.js';

const IS_MSK = true;
const COLORS_ZOOM_THRESHOLD = 10;


/**
 * получение цвета линии трэка
 * в зависимости от скорости
 * @param speed
 * @returns color string
 */
export function getTrackColor(speed, type_id, opacity = 1) {
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
    + opacity + ')' : null
  }

  let speed_max = getTypeById(type_id).speed_max;

  /* @TODO STOP SIGN
   if ( speed === 0 ){
   return colors.stop
   }*/

  if (speed >= 0 && speed < 10) {
    result = TRACK_COLORS.green
  }

  if (speed >= 10 && speed < 20) {
    result = TRACK_COLORS.greenyellow
  }

  if (speed >= 20 && speed < 30) {
    result = TRACK_COLORS.greenyellow
  }

  if (speed >= 30 && speed < speed_max) {
    result = TRACK_COLORS.yellow
  }

  if (speed >= speed_max) {
    result = TRACK_COLORS.red
  }

  return opacity === 1 ? result : hexToRgba(result, opacity);
}

export default class Track {

  constructor(parent) {

    this.map = parent.map;
    this.ctx = parent.ctx;
    this.parent = parent;
    this.points = null;

    // todo render after fetch automatically
    this.fetch()
  }

  addPoint(point) {
  	console.log( 'updating track of', this.parent, 'with', point)
  }

  fetch(from_dt = getStartOfToday(), to_dt = new Date().getTime()) {

    let id = this.parent.id;

    return getTrack(id, from_dt, to_dt)
      .then((track) => {
        this.points = track;
        console.log('track fetched for', this.parent)
        this.render()
      // @todo handle receive track
      })

  }


  render() {
    let map = this.map;
    let zoom = map.getView().getZoom();

    console.log( 'rendering track of', this.parent)
    if (zoom > COLORS_ZOOM_THRESHOLD) {
      this.renderInColors()
    } else {
      this.renderSimple()
    }
  }

  renderSimple() {
    let point = this.parent;
    let track = this.points;
    let ctx = this.ctx;

    if (!track || track.length < 2) {
      return
    }

    ctx.strokeStyle = '#3C68FA';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    let first = projectToPixel(track[0].coords_msk);

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1, till = track.length - 1; i < till; i++) {
      let coords = projectToPixel(track[i].coords_msk);
      ctx.lineTo(coords.x, coords.y);
    }

    // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
    // получается некрасиво в том случае, если обновление происходит редко
    // и машина резко перемещается на другую точку
    if (point.status === 1 && point.TRACK_NEEDS_UPDATE) {
      let coords = projectToPixel(point.coords_msk);
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
  }

  getExtent() {
  	// todo get extent of points
  	// for zooming etc
  }


  /**
   * рисует точку трэка
   * @param coords
   * @param color
   */
  drawTrackPoint(coords, color) {
    let ctx = this.ctx;
    if (DRAW_POINTS) {
      let cachedPoint = getTrackPointByColor(color);
      ctx.drawImage(
        cachedPoint,
        coords.x - TRACK_POINT_RADIUS - 1,
        coords.y - TRACK_POINT_RADIUS - 1,
        (TRACK_POINT_RADIUS + 1) * 2,
        (TRACK_POINT_RADIUS + 1) * 2);
    }
  }
  /**
   * TODO http://jsperf.com/changing-canvas-state/3
   * @param ctx
   * @param DRAW_POINTS
   */
  renderInColors(DRAW_POINTS) {

    let parent = this.parent;
    let track = this.points;
    let TRACK_LINE_WIDTH = DRAW_POINTS ? 4 : TRACK_LINE_WIDTH;
    let ctx = this.ctx;

    if (!track || track.length < 2) {
      return
    }

    let type_id = parent.point.car.type_id;

    const RENDER_GRADIENT = this.store.state.showTrackingGradient;

    // TODO убрать эту функцию, ибо она порождена багой на бэкэнде
    function getSpeed(trackPoint) {
      return 'speed_avg' in trackPoint ? trackPoint.speed_avg : trackPoint.speed
    }

    let firstPoint = projectToPixel(track[0].coords);
    let prevCoords = firstPoint;

    ctx.lineWidth = TRACK_LINE_WIDTH;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);

    let prevRgbaColor = ctx.strokeStyle = getTrackColor(getSpeed(track[0]), type_id, TRACK_LINE_OPACITY);

    for (let i = 1, till = track.length - 1; i < till; i++) {
      let coords = projectToPixel(track[i].coords);
      let speed = getSpeed(track[i]);
      let rgbaColor = getTrackColor(speed, type_id, TRACK_LINE_OPACITY);
      let hexColor = getTrackColor(speed, type_id);

      // если предыдущий цвет не соответствует новому
      // нужно закрыть предыдущую линию
      // и нарисовать новую
      if (prevRgbaColor !== rgbaColor) {
        if (RENDER_GRADIENT) {

          // stroke path before
          ctx.stroke();

          // make gradient fill
          let gradient = ctx.createLinearGradient(prevCoords.x, prevCoords.y, coords.x, coords.y);
          gradient.addColorStop('0', prevRgbaColor);
          gradient.addColorStop('1', rgbaColor);

          // make new path and stroke that
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(prevCoords.x, prevCoords.y);
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();

          this.drawTrackPoint(coords, hexColor);
        } else {
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();

          this.drawTrackPoint(coords, hexColor);
        }

        // start new path
        // and reset color && lineWidth
        ctx.strokeStyle = rgbaColor;
        ctx.lineWidth = TRACK_LINE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);

      } else { // если цвет не менялся

        ctx.strokeStyle = prevRgbaColor;
        ctx.lineWidth = TRACK_LINE_WIDTH;
        ctx.lineTo(coords.x, coords.y);

        // оптимизация, типа
        // рисовать кружки только там, где были заметные изменения скорости
        if (!SHOW_ONLY_POINTS_WITH_SPEED_CHANGES) {
          ctx.stroke();

          this.drawTrackPoint(coords, hexColor);

          ctx.strokeStyle = rgbaColor;
          ctx.lineWidth = TRACK_LINE_WIDTH;
          ctx.beginPath();
          ctx.moveTo(coords.x, coords.y);
        }
      }

      prevCoords = coords;
      prevRgbaColor = rgbaColor;
    }

    // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
    // получается некрасиво в том случае, если обновление происходит редко
    // и машина резко перемещается на другую точку
    if (point.status === 1 && point.TRACK_NEEDS_UPDATE) {
      let coords = projectToPixel(point.coords);
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke()
  }

}
