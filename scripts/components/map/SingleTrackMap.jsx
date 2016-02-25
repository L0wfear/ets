import React from 'react';
import Map from './Map.jsx';
import CarMarker from '../markers/car/Marker.js';
import { projectToPixel } from './MskAdapter.js';
import { getTrack } from '../../adapter.js';
import { getStartOfToday, makeDate, makeTime } from '../../utils/dates.js';
import { swapCoords, roundCoordinates } from '../../utils/geo.js';
import { TRACK_COLORS, TRACK_LINE_OPACITY, TRACK_LINE_WIDTH, TRACK_POINT_RADIUS, SHOW_ONLY_POINTS_WITH_SPEED_CHANGES } from '../../constants/track.js';

const COLORS_ZOOM_THRESHOLD = 8;

export default class SingleTrackMap extends Map {
  constructor(props) {
    super(props);

    console.log('dwqdwdwq');
    this.CAR_GOV_NUMBER = "А868ММ77";
    this.state = {}
    this.onUpdateCallback = () => {};
  }

  componentDidMount() {
    super.componentDidMount();

    this.fetch('911281');
  }

  onMouseMove() {

  }

  onClick() {

  }

  fetch(key, point, from_dt = getStartOfToday(), to_dt = new Date().getTime()) {

    if (to_dt - from_dt > 5 * 24 * 60 * 60 * 1000) {
      global.NOTIFICATION_SYSTEM.notify('Период запроса трэка не может превышать 5 суток', 'warning')
      return;
    }

    let id = key; //'20268';

    this.continuousUpdating = false;

    return getTrack(id, from_dt, to_dt)
      .then((track) => {
        //console.log(track);
        this.points = track;
        setTimeout(() => {

          this.renderTrack(point);
          this.onUpdateCallback();
        }, 1000)
        // console.log('track fetched for', this.owner)
      });

  }

  renderTrack(point) {
    let map = this.map;
    let zoom = map.getView().getZoom();

    if (zoom > COLORS_ZOOM_THRESHOLD) {
      this.renderInColors();
    } else {
      this.renderSimple(point);
    }
  }

  renderSimple(point) {
    //let owner = this.owner;
    if (!this.canvas) return;
    let track = this.points;
    let ctx = this.canvas.getContext('2d');

    if (!track || track.length < 2) {
      return;
    }

    ctx.strokeStyle = TRACK_COLORS.blue;
    ctx.lineWidth = TRACK_LINE_WIDTH;
    ctx.lineCap = 'round';

    let first = projectToPixel(track[0].coords_msk);

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1, till = track.length - 1; i < till; i++) {
      let coords = projectToPixel(track[i].coords_msk);
      ctx.lineTo(coords.x, coords.y);
    }

    //if (owner.point.status === 1 && this.continuousUpdating) {
    // let coords = projectToPixel(swapCoords(point.coords_msk));
    // ctx.lineTo(coords.x, coords.y);
    //}


    console.log('RENDERING TRACK');

    ctx.stroke();
  }
}
