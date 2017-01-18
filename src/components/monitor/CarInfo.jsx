import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { makeDateFromUnix, getStartOfToday, makeUnixTime, secondsToTime, makeDate, makeTime } from 'utils/dates';
import { sensorsMapOptions } from 'constants/sensors.js';
import Panel from 'components/ui/Panel.jsx';
import DatePicker from 'components/ui/DatePicker.jsx';
import cx from 'classnames';
// import SpeedChart from 'components/ui/charts/SpeedChart.jsx';
import config from '../../config.js';
import MissionFormWrap from '../missions/mission/MissionFormWrap.jsx';
import VehicleAttributes from './VehicleAttributes.jsx';
import LineChart from './LineChart';

@autobind
export default class CarInfo extends Component {

  static get propTypes() {
    return {
      car: PropTypes.object,
      flux: PropTypes.object,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.store = this.props.flux.getStore('points');
    this.state = {
      imageUrl: null,
      trackPaused: 'stopped',
      trackingMode: false,
      missions: [],
      showMissionForm: false,
      selectedMission: null,
      from_dt: getStartOfToday(),
      to_dt: new Date(),
      from_dt_: getStartOfToday(),
      to_dt_: new Date(),
      tillNow: true,
      car: {},
      tab: 0,
      chartTab: 0,
      sensors: {
        equipment: [],
        level: [],
      },
    };
  }

  async componentDidMount() {
    const { flux } = this.props;
    if (this.props.car && !this.state.imageUrl) {
      this.fetchImage();
      this.fetchTrack();
      const carsList = flux.getStore('objects').state.carsList;
      const car = find(carsList, c => c.gov_number === this.props.car.car.gov_number);
      if (car) {
        const car_id = car.asuods_id;
        const missions = await flux.getActions('cars').getCarMissions(car_id, this.state.from_dt, this.state.to_dt);
        this.setState({ missions: missions.result, car });
      }
    }
  }

  async componentWillReceiveProps(props) {
    if (props.car !== this.props.car) {
      this.fetchImage(props);
      this.fetchTrack(props);
      this.stopTrackPlaying();
      this.setState({ trackPaused: 'stopped', car: props.car });
    }
    if (props.car.id !== this.props.car.id) {
      const carsList = this.props.flux.getStore('objects').state.carsList;
      const car = find(carsList, c => c.gov_number === props.car.car.gov_number);
      if (car) {
        const car_id = car.asuods_id;
        const missions = await this.props.flux.getActions('cars').getCarMissions(car_id, this.state.from_dt, this.state.to_dt);
        this.setState({ missions: missions.result, car });
      }
    }
  }

  componentWillUnmount() {
    const track = this.props.car.marker.track;
    track.onUpdate();
    this.stopTrackPlaying();
  }

  toggleCarTracking() {
    const store = this.store;
    const trackingMode = store.state.trackingMode;
    store.setTracking(!trackingMode);

    this.setState({ trackingMode: !trackingMode });
  }

  onTillNowChange() {
    const tillNow = this.state.tillNow;
    const notTillNow = !tillNow;
    const state = { tillNow: notTillNow };

    if (notTillNow) {
      state.from_dt = state.from_dt_ = getStartOfToday();
      state.to_dt = state.to_dt_ = new Date();
    }

    const track = this.props.car.marker.track;
    track.setContinuousUpdating(notTillNow);

    this.setState(state);
    this.fetchTrack();
  }

  onShowGradientChange() {
    const store = this.store;
    const flag = store.state.showTrackingGradient;
    store.handleSetShowGradient(!flag);
  }

  fetchVehicleData() {
    this.setState({ from_dt: this.state.from_dt_, to_dt: this.state.to_dt_ }, this.fetchTrack);
  }

  fetchImage(props = this.props) {
    const { flux } = this.props;
    const car = props.car;
    const type_id = car.car.type_id;
    flux.getActions('cars').getCarImage(type_id).then(url => this.setState({ imageUrl: url }));
  }

  fetchTrack(props = this.props) {
    const { from_dt, to_dt } = this.state;
    const track = props.car.marker.track;

    // обновление инфы о последней точке при обновлении трэка
    track.onUpdate(() => {
      const dt = new Date();
      if (this.state.tillNow) {
        this.setState({ to_dt_: dt }); // обновляем дату "по"
      }
    });

    track.fetch(this.props.flux, from_dt, to_dt);
  }

  toggleTrackPlaying() {
    const { marker } = this.props.car;
    this.state.trackingMode && this.toggleCarTracking();
    marker.togglePlay();
    this.setState({ trackPaused: !this.state.trackPaused });
  }

  stopTrackPlaying() {
    const { marker } = this.props.car;
    marker.stopAnimation();
    this.setState({ trackPaused: 'stopped' });
  }

  async setMissionById(id) {
    const response = await this.props.flux.getActions('missions').getMissionById(id);
    this.setState({ selectedMission: response.result.rows[0], showMissionForm: true });
  }

  // TODO переместить это на более высокий уровень абстракции
  zoomToTrack() {
    const store = this.store;
    store.setTracking(false);
    this.setState({ trackingMode: false });

    const marker = this.props.car.marker;
    const extent = marker.track.getExtent();
    const map = marker.map;
    const view = map.getView();

    view.fit(extent, map.getSize(), { padding: [50, 550, 50, 50] });
  }

  showOnMap(timestamp, e, event) {
    const threshold = e && e.point.series.closestPointRange ? e.point.series.closestPointRange : 0;
    const points = this.props.car.marker.track.points.filter(p => (timestamp >= p.timestamp - threshold) && (timestamp <= p.timestamp + threshold));
    const point = points.length === 1 ? points[0] : points.reduce((prev, curr) => (Math.abs(curr.speed_avg - e.point.y) < Math.abs(prev.speed_avg - e.point.y) ? curr : prev));
    const extent = [point.coords_msk[0], point.coords_msk[1], point.coords_msk[0], point.coords_msk[1]];
    const map = this.props.car.marker.map;
    const track = this.props.car.marker.track;
    map.getView().fit(extent, map.getSize(), { padding: [50, 550, 50, 50], maxZoom: 13 });
    map.get('parent').handleFeatureClick(track, point, event);
  }

  toggleSensor(field, id) {
    const { sensors } = this.state;
    const index = sensors[field].indexOf(id);
    if (index > -1) {
      sensors[field].splice(index, 1);
    } else {
      sensors[field].push(id);
    }
    this.props.car.marker.track.sensorsState = sensors;
    this.props.car.marker.track.render();
    this.setState({ sensors });
  }

  renderMain() {
    const { imageUrl, trackingMode } = this.state;
    const { car } = this.props;

    const title = ''; // должен быть model title
    const marker = car.marker;
    const isTrackLoaded = marker.hasTrackLoaded();

    const trackBtnClass = cx('toggle-tracking-mode', 'btn-sm', 'btn', 'track-btn', { tracking: trackingMode, 'btn-default': !trackingMode });
    const trackBtnIconClass = cx('glyphicon', 'glyphicon-screenshot', { 'tracking-animate': trackingMode });
    const zoomToTrackClass = cx('zoom-to-track-extent', 'btn-sm', 'btn', { 'btn-default': isTrackLoaded, 'btn-disabled': !isTrackLoaded });

    return (
      <Panel title={title}>
        <button disabled={this.state.trackPaused !== 'stopped'} className={trackBtnClass} onClick={this.toggleCarTracking} title="Следить за машиной">
          <span className={trackBtnIconClass} />&nbsp;{trackingMode ? 'Следим' : 'Следить'}
        </button>
        <button disabled={this.state.trackPaused !== 'stopped'} className={zoomToTrackClass} onClick={isTrackLoaded && this.zoomToTrack} title="Показать трек">
          <span className="glyphicon glyphicon-resize-full" />&nbsp;Трек
        </button>
        <img role="presentation" className="car-info-image" src={imageUrl ? config.images + imageUrl : ''} />
        {marker.track.getLegend()}
      </Panel>
    );
  }

  renderInfo() {
    const { missions = [] } = this.state;
    const { car } = this.props;
    const { marker } = car;
    const { parkings = [] } = this.props.car.marker.track;
    let missionsRender = (
      <div style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {missions.map((mission) => {
          const missionStart = makeUnixTime(mission.date_start);
          const missionEnd = makeUnixTime(mission.date_end);
          const parkingTime = parkings.length ? parkings.map((p) => {
            const start = p.start_point.timestamp > missionStart ? p.start_point.timestamp : missionStart;
            const end = p.end_point.timestamp < missionEnd ? p.end_point.timestamp : missionEnd;
            if (end < start) return 0;
            return end - start;
          }).reduce((a, b) => a + b) : 0;
          return (
            <div key={mission.id}>
              <span
                onClick={this.setMissionById.bind(this, mission.id)}
                style={{ whiteSpace: 'nowrap', display: 'block', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {`№${mission.number} - ${mission.technical_operation_name}`}
              </span>
              <span style={{ color: '#666' }}>{`Время стоянок: ${secondsToTime(parkingTime)}`}</span>
            </div>
          );
        })}
      </div>
    );

    if (!missions.length) missionsRender = 'Нет данных';

    return (
      <div className="car-info-tracking">
        <Panel>
          <VehicleAttributes point={car} car={this.state.car} lastPoint={marker.hasTrackLoaded() && marker.track.getLastPoint()} />
        </Panel>
        <Panel title="Задания" className="chart-datepickers-wrap">
          {missionsRender}
        </Panel>
        <MissionFormWrap
          onFormHide={() => this.setState({ showMissionForm: false })}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
        />
      </div>
    );
  }

  renderSpeedChart() {
    const { points } = this.props.car.marker.track;
    if (!points) return 'Загрузка...';
    if (!points.length) return 'Нет данных';
    const timestamps = points.map(p => p.timestamp);
    const sensorsData = [];
    let sensorsList = points.filter(p => p.sensors && p.sensors.equipment).map((p) => {
      p.sensors.equipment.forEach((s) => { s.timestamp = p.timestamp; });
      return p.sensors.equipment;
    });
    sensorsList = groupBy(flatten(sensorsList), s => s.id);
    Object.keys(sensorsList).forEach((id, i) => {
      const sensorOptions = sensorsMapOptions(i, this.props.car.marker.track.maxSpeed);
      const values = sensorsList[id].map(s => [s.timestamp, sensorOptions.value]);
      sensorsData.push({
        name: `Датчик №${i + 1}`,
        connectNulls: false,
        color: sensorOptions.color,
        data: timestamps.map((t) => {
          const s = values.find(v => v[0] === t);
          if (s && s[1]) {
            return s[1];
          }
          return null;
        }),
      });
    });
    const data = [
      {
        name: 'Скорость ТС',
        data: points.map(p => parseInt(p.speed_avg, 10)),
        color: 'rgba(90, 242, 18, 1)',
      },
      {
        name: 'Максимальная скорость',
        data: points.map(() => parseInt(this.props.car.marker.track.maxSpeed, 10)),
        color: 'rgba(205, 17, 71, 1)',
      },
    ].concat(sensorsData).map((d) => {
      d.data = d.data.map((v, i) => [timestamps[i], v]);
      return d;
    });
    return <LineChart name="speedChart" data={data} onClick={e => this.showOnMap(e.point.x, e)} />;
  }

  renderFuelChart() {
    const { points, events } = this.props.car.marker.track;
    if (!points) return 'Загрузка...';
    if (!points.length) return 'Нет данных';
    const timestamps = points.map(p => p.timestamp);
    const sensorsData = [];
    let sensorsList = points.filter(p => p.sensors && p.sensors.level).map((p) => {
      p.sensors.level.forEach((s) => { s.timestamp = p.timestamp; });
      return p.sensors.level;
    });
    sensorsList = groupBy(flatten(sensorsList), s => s.id);
    Object.keys(sensorsList).forEach((id, i) => {
      const color = sensorsMapOptions(i).color;
      const values = sensorsList[id].map(s => [s.timestamp, s.val]);
      sensorsData.push({
        name: `ДУТ №${i + 1}`,
        connectNulls: false,
        color,
        data: timestamps.map((t) => {
          const s = values.find(v => v[0] === t);
          if (s && s[1]) {
            return s[1];
          }
          return null;
        }),
      });
    });
    const data = sensorsData.map((d) => {
      d.data = d.data.map((v, i) => [timestamps[i], v]);
      return d;
    });

    let sumEvents = [];
    Object.keys(events).forEach((k) => {
      events[k].forEach(e => e.id = k);
      sumEvents = sumEvents.concat(events[k]);
    });
    sumEvents = sumEvents.map(e => ({
      ...e,
      date: `${makeDate(new Date(e.start_point.timestamp * 1000))} ${makeTime(new Date(e.start_point.timestamp * 1000), true)}`,
      type_name: e.type === 'leak' ? 'Слив' : 'Заправка',
      value: `${Math.abs(e.val)} л`,
    }));
    return (
      <div>
        <LineChart name="fuelChart" data={data} onClick={e => this.showOnMap(e.point.x, e)} />
        {this.renderEventTable(sumEvents)}
      </div>
    );
  }

  renderEventTable(data) {
    const rows = data.map((d, i) => (
      <tr key={i} onClick={() => this.showOnMap(d.start_point.timestamp, null, true)}>
        <td>{d.date}</td>
        <td>{d.type_name}</td>
        <td>{d.value}</td>
      </tr>
    ));
    return (
      <table className="car-info-event-table">
        <thead>
          <tr>
            <td>Дата и время</td>
            <td>Событие</td>
            <td>Уровень</td>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  renderCharts() {
    return (
      <div>
        <ButtonGroup className="car-info-chart-menu">
          <Button className={!this.state.chartTab && 'active'} onClick={() => this.setState({ chartTab: 0 })}>Датчики топлива</Button>
          <Button className={this.state.chartTab && 'active'} onClick={() => this.setState({ chartTab: 1 })}>Датчики скорости</Button>
        </ButtonGroup>
        <Panel>
          {this.state.chartTab ? this.renderSpeedChart() : this.renderFuelChart()}
        </Panel>
      </div>
    );
  }

  renderTracking() {
    const marker = this.props.car.marker;
    const isTrackLoaded = marker.hasTrackLoaded();
    const tillNow = this.state.tillNow;
    const reloadBtnCN = cx('glyphicon', 'glyphicon-repeat', { 'tracking-animate': tillNow && marker.hasTrackLoaded() });

    // const store = this.store;
    // const showGradient = store.state.showTrackingGradient;

    return (
      <div className="car-info-tracking">
        <Panel title="Трекинг" className="chart-datepickers-wrap">
          <DatePicker
            onChange={date => this.setState({ from_dt_: date })}
            date={this.state.from_dt_}
            disabled={tillNow}
          />
          &nbsp;–&nbsp;
          <DatePicker
            onChange={date => this.setState({ to_dt_: date })}
            date={this.state.to_dt_}
            disabled={tillNow}
          />
          {/* <label className="gradient-checkbox">
            <input type="checkbox" checked={showGradient} ref="showGradient" onChange={this.onShowGradientChange}/> С градиентом
          </label>*/}
          <label className="till-now-checkbox">
            <input type="checkbox" checked={tillNow} onChange={this.onTillNowChange} /> За сегодня
          </label>

          <Button
            title="Перезагрузить данные"
            className="reload-button"
            onClick={this.fetchVehicleData}
            disabled={tillNow}
          >
            <span className={reloadBtnCN} />
          </Button>

          <div>
            <div className="vehicle-attributes-list__item" style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }}>
              Протяженность, км: <span className="value">{isTrackLoaded && marker.track.getDistance()}</span>
            </div>
          </div>
        </Panel>
        <Panel title="Проигрывание трека">
          <div className="track-player">
            <Button onClick={this.toggleTrackPlaying}><Glyphicon glyph={this.state.trackPaused ? 'play' : 'pause'} /></Button>
            <Button disabled={this.state.trackPaused === 'stopped'} onClick={this.stopTrackPlaying}><Glyphicon glyph={'stop'} /></Button>
          </div>

          {this.state.trackPaused !== 'stopped' && <dl className="car-info-play-info">
            <dt>Координаты:</dt>
            <dd>{parseFloat(marker.currentCoords[1]).toFixed(5)}, {parseFloat(marker.currentCoords[0]).toFixed(5)}</dd>
            <dt>Время:</dt>
            <dd>{makeDateFromUnix(marker.currentTime)}</dd>
            <dt>Скорость:</dt>
            <dd>{marker.currentSpeed}</dd>
          </dl>}
        </Panel>
        <Panel title="Отображение датчиков на треке">
          {this.renderSensorsToggle()}
        </Panel>
      </div>
    );
  }

  renderSensorsToggle() {
    const { points } = this.props.car.marker.track;
    if (!points) return 'Загрузка...';
    if (!points.length) return 'Нет данных';
    const equipmentIdList = Object.keys(groupBy(flatten(points.filter(p => p.sensors && p.sensors.equipment).map(p => p.sensors.equipment)), s => s.id));
    const fuelIdList = Object.keys(groupBy(flatten(points.filter(p => p.sensors && p.sensors.level).map(p => p.sensors.level)), s => s.id));
    return (
      <div>
        <div className="car-info-sensors-toggle">
          <label>Датчики уровня топлива</label>
          {fuelIdList.map(id => (
            <div key={id} onClick={() => this.toggleSensor('level', id)}>
              <input type="checkbox" onChange={() => {}} checked={this.state.sensors.level.includes(id) && 'checked'} />
              {` ДУТ №${id}`}
            </div>
          ))}
        </div>
        <div className="car-info-sensors-toggle">
          <label>Датчики навесного оборудования</label>
          {equipmentIdList.map((id, i) => (
            <div key={id} onClick={() => this.toggleSensor('equipment', id)}>
              <input type="checkbox" onChange={() => {}} checked={this.state.sensors.equipment.includes(id) && 'checked'} />
              {` Датчик №${i + 1}`}
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { car } = this.props;
    const { tab } = this.state;

    if (!car) {
      return null;
    }

    const marker = this.props.car.marker;
    const plate = car.car.gov_number;

    return (
      <div className="car-info" key={marker.id}>
        <h3 className="car-info-plate">{plate}</h3>
        {this.renderMain()}
        <ButtonGroup className="car-info-menu">
          <Button className={this.state.tab === 0 && 'active'} onClick={() => this.setState({ tab: 0 })}>Информация</Button>
          <Button className={this.state.tab === 1 && 'active'} onClick={() => this.setState({ tab: 1 })}>Графики</Button>
          <Button className={this.state.tab === 2 && 'active'} onClick={() => this.setState({ tab: 2 })}>Трекинг</Button>
        </ButtonGroup>
        {tab === 0 && this.renderInfo()}
        {tab === 1 && this.renderCharts()}
        {tab === 2 && this.renderTracking()}
        {/* <FuelChart from={this.state.from_dt} to={this.state.to_dt} id={car.id}/>*/}
        {/* <SpeedChart track={marker.hasTrackLoaded() && marker.track} />*/}
      </div>
    );
  }
}
