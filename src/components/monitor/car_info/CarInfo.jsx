import React, { Component, PropTypes } from 'react';
import { groupBy, flatten, get } from 'lodash';
import { autobind } from 'core-decorators';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

import { sensorTrackColor } from 'constants/sensors';
import { LOAD_PROCESS_TEXT } from 'constants/statuses';
import { TRACK_COLORS } from 'constants/track.js';
import { makeDateFromUnix, getStartOfToday } from 'utils/dates';
import Panel from 'components/ui/Panel.jsx';
import DatePicker from 'components/ui/input/DatePicker';
import config from '../../../config.js';
import Charts from './Charts.jsx';
import VehicleInfo from './VehicleInfo.jsx';

const SensorColorLegend = ({ colors }) => {
  const rectStyle = {
    width: 30,
    height: 10,
    display: 'inline-block',
    marginRight: 10,
    border: '1px solid black',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'default',
  };

  const items = colors.map((color, i) => (
    <div style={itemStyle} key={i}>
      <div style={{ ...rectStyle, backgroundColor: color }} />
      <span>{`${i + 1} ${i === 0 ? 'датчик' : 'датчика'} в работе`}</span>
    </div>
  ));

  return (
    <div>{items}</div>
  );
};


/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-for */

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
      trackPaused: true,
      trackingMode: false,
      trackPoints: [],
      from_dt: getStartOfToday(),
      to_dt: new Date(),
      from_dt_: getStartOfToday(),
      tillNow: true,
      car: {},
      tab: 0,
      sensors: {
        equipment: [],
        level: [],
      },
      sensorsInfo: {},
    };
  }

  componentDidMount() {
    if (this.props.car) {
      this.fetchCarInfo();
      this.fetchTrack();
    }
  }

  componentWillReceiveProps(props) {
    if (props.car.id !== this.props.car.id || props.car.track !== this.props.car.track) {
      this.fetchCarInfo(props);
      this.fetchTrack(props);
      this.stopTrackPlaying();

      // TODO понять почему track не приходит
      if (!!props.car.marker.track) {
        props.car.marker.track.sensorsState = {
          equipment: [],
          level: [],
        };
      }
      this.setState({
        trackPaused: true,
        sensors: {
          equipment: [],
          level: [],
        },
      });
    }
  }

  componentWillUnmount() {
    const track = this.props.car.marker.track;
    track.onUpdate();
    this.stopTrackPlaying();
  }

  onTillNowChange() {
    const notTillNow = !this.state.tillNow;
    const state = { tillNow: notTillNow };

    if (notTillNow) {
      state.from_dt = state.from_dt_ = getStartOfToday();
      state.to_dt = state.to_dt_ = new Date();
    }

    const track = this.props.car.marker.track;
    track.setContinuousUpdating(notTillNow);

    this.setState(state, this.fetchTrack);
  }

  onShowGradientChange() {
    const store = this.store;
    const flag = store.state.showTrackingGradient;
    store.handleSetShowGradient(!flag);
  }

  getLegend() {
    const speed = this.state.maxSpeed;
    return (
      <div className="track-legend">
        <div className="track-legend-item">
          <div className="track-legend-point" style={{ backgroundColor: TRACK_COLORS.green }} />
          <div className="track-legend-text">0 км/ч</div>
        </div>
        <div className="track-legend-item">
          <div className="track-legend-point" style={{ backgroundColor: TRACK_COLORS.red }} />
          <div className="track-legend-text">{speed != null ? `${speed}+ км/ч` : 'нет данных'}</div>
        </div>
      </div>
    );
  }

  async fetchCarInfo(props = this.props) {
    const carList = props.flux.getStore('objects').state.carsList;
    const track = props.car.marker.track;
    if (!track) return;

    const car = carList.find(c => c.gov_number === props.car.car.gov_number);
    if (!car) {
      global.NOTIFICATION_SYSTEM.notify(`Нет информации по выбранной автомашине с гос. номером ${props.car.car.gov_number}`, 'info', 'tr');
      return;
    }

    const info = await this.props.flux.getActions('cars').getCarInfo(car.asuods_id);
    track.maxSpeed = info.max_speed;
    this.setState({ missions: info.missions, maxSpeed: info.max_speed, imageUrl: car ? car.type_image_name : null });
  }

  fetchVehicleData() {
    this.setState({ from_dt: this.state.from_dt_, to_dt: this.state.to_dt_ }, this.fetchTrack);
  }

  fetchTrack(props = this.props) {
    const { from_dt, to_dt } = this.state;
    const track = props.car.marker.track;
    if (!track) return;

    // обновление инфы о последней точке при обновлении трэка
    track.onUpdate(() => {
      const dt = new Date();
      if (this.state.tillNow) {
        this.setState({ to_dt_: dt }); // обновляем дату "по"
      }
    });

    track.fetch(this.props.flux, from_dt, to_dt).then((trackInfo) => {
      this.setState({
        sensorsInfo: trackInfo.sensors,
        trackPoints: trackInfo.track,
      });
    });
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
    this.setState({ trackPaused: true });
  }

  toggleCarTracking() {
    const store = this.store;
    const trackingMode = store.state.trackingMode;
    store.setTracking(!trackingMode);

    this.setState({ trackingMode: !trackingMode });
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

    view.fit(extent, { padding: [50, 550, 50, 50] });
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
    const { imageUrl } = this.state;
    const trackingMode = this.state.trackingMode || this.store.state.trackingMode;
    const { car } = this.props;

    const title = ''; // должен быть model title
    const marker = car.marker;
    const isTrackLoaded = marker.hasTrackLoaded();

    const trackBtnClass = cx('toggle-tracking-mode', 'btn-sm', 'btn', 'track-btn', { tracking: trackingMode, 'btn-default': !trackingMode });
    const trackBtnIconClass = cx('glyphicon', 'glyphicon-screenshot', { 'tracking-animate': false });
    const zoomToTrackClass = cx('zoom-to-track-extent', 'btn-sm', 'btn', { 'btn-default': isTrackLoaded, 'btn-disabled': !isTrackLoaded });

    return (
      <Panel title={title}>
        <button disabled={!this.state.trackPaused} className={trackBtnClass} onClick={this.toggleCarTracking} title="Следить за машиной">
          <span className={trackBtnIconClass} />&nbsp;{trackingMode ? 'Следим' : 'Следить'}
        </button>
        <button disabled={!this.state.trackPaused} className={zoomToTrackClass} onClick={isTrackLoaded && this.zoomToTrack} title="Показать трек">
          <span className="glyphicon glyphicon-resize-full" />&nbsp;Трек
        </button>
        <img role="presentation" className="car-info-image" src={imageUrl ? config.images + imageUrl : ''} />
        {this.getLegend()}
      </Panel>
    );
  }

  renderTracking() {
    const marker = this.props.car.marker;
    const isTrackLoaded = marker.hasTrackLoaded();
    const tillNow = this.state.tillNow;
    const reloadBtnCN = cx('glyphicon', 'glyphicon-repeat', { 'tracking-animate': false });

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
            <Button disabled={this.state.trackPaused} onClick={this.stopTrackPlaying}><Glyphicon glyph={'stop'} /></Button>
          </div>

          {!this.state.trackPaused && <dl className="car-info-play-info">
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
    const { track = false } = this.props.car.marker;
    if (!track) return 'Ошибка при загрузке трека';
    const { points } = track;
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
          {
            equipmentIdList.map((id, i) => {
              const sensorName = get(this.state.sensorsInfo, [id, 'type_name']);
              return (
                <div key={id} onClick={() => this.toggleSensor('equipment', id)}>
                  <input type="checkbox" onChange={() => {}} checked={this.state.sensors.equipment.includes(id) && 'checked'} />
                  {` Датчик №${i + 1} - ${sensorName || LOAD_PROCESS_TEXT}`}
                </div>
              );
            })
        }
        </div>
        {equipmentIdList.length > 0 &&
          <div className="car-info-sensors-toggle" >
            <SensorColorLegend colors={sensorTrackColor.slice(1)} />
          </div>
        }
      </div>
    );
  }

  render() {
    const { car } = this.props;
    const { tab, from_dt, to_dt, missions } = this.state;

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
        {tab === 0 && <VehicleInfo missions={missions} car={car} from_dt={from_dt} to_dt={to_dt} flux={this.props.flux} />}
        <div className={tab !== 1 ? 'hidden' : ''}>
          <Charts trackPoints={this.state.trackPoints} car={car} />
        </div>
        {tab === 2 && this.renderTracking()}
      </div>
    );
  }
}
