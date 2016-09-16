import React, { Component } from 'react';
import Panel from 'components/ui/Panel.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import { getStatusById } from 'constants/statuses';
import config from '../../config.js';
import { makeDate, makeTime, makeDateFromUnix, getStartOfToday } from 'utils/dates';
import FuelChart from 'components/ui/charts/FuelChart.jsx';
import SpeedChart from 'components/ui/charts/SpeedChart.jsx';
import { roundCoordinates } from 'utils/geo';
import DatePicker from 'components/ui/DatePicker.jsx';
import { getTypeById } from 'utils/labelFunctions';
import MissionFormWrap from '../missions/mission/MissionFormWrap.jsx';

class VehicleAttributes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      attributes: [],
    };
  }

  parseProps(props) {
    const vehicle = props.vehicle;
    const car = vehicle.car;

    const attributes = [];
    const addAttribute = (name, value) => {
      if (typeof value !== 'undefined') {
        attributes.push({
          name,
          value,
        });
      }
    };

    const makeLastPointString = (point) => {
      const dt = new Date(point.timestamp * 1000);
      return makeDate(dt) + ' ' + makeTime(dt, true) + ' [' + roundCoordinates(point.coords_msk) + ']';
    };

    addAttribute('Рег. номер ТС', car.gov_number);
    addAttribute('ID БНСО', vehicle.id);
    getStatusById(vehicle.status) && addAttribute('Статус', getStatusById(vehicle.status).title);
    getTypeById(car.type_id) && addAttribute('Тип техники', getTypeById(car.type_id).title);
    // getModelById(car.model_id) && addAttribute('Шасси', getModelById(car.model_id).title)

    if (props.lastPoint) {
      // todo при клике на "последнюю точку" центрировать по координатам
      addAttribute('Последняя точка', makeLastPointString(props.lastPoint));
    } else {
      addAttribute('Последняя точка', makeLastPointString({
        timestamp: vehicle.timestamp,
        coords_msk: vehicle.coords_msk,
      }));
    }

    return attributes;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => (state.attributes = this.parseProps(nextProps)));
  }

  renderAttribute({ name, value }) {
    return (
      <div key={name} className="vehicle-attributes-list__item">
           {name}: <span className="value">{value}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="vehicle-attributes-list">
        {this.state.attributes.map(attribute => this.renderAttribute(attribute))}
      </div>
    );
  }
}

export default class CarInfo extends Component {

  static get propTypes() {
    return {

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
    };
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
    const model_id = car.car.model_id;
    const type_id = car.car.type_id;
    flux.getActions('cars').getCarImage(car.id, type_id, model_id).then(url => this.setState({ imageUrl: url }));
  }

  fetchTrack(props = this.props) {
    let { from_dt, to_dt, tillNow } = this.state;
    const track = props.car.marker.track;

    // обновление инфы о последней точке при обновлении трэка
    track.onUpdate(() => {
      const dt = new Date();
      if (this.state.tillNow) {
        this.setState({ to_dt_: dt }); // обновляем дату "по"
      }
    });

    track.fetch(from_dt, to_dt);
  }

  async componentDidMount() {
    if (this.props.car && !this.state.imageUrl) {
      this.fetchImage();
      this.fetchTrack();
      const carsList = this.props.flux.getStore('objects').state.carsList;
      const car = _.find(carsList, car => car.gov_number === this.props.car.car.gov_number);
      if (car) {
        const car_id = car.asuods_id;
        const missions = await this.props.flux.getActions('missions').getMissionsByCarAndDates(car_id, this.state.from_dt, this.state.to_dt, true, 1);
        this.setState({ missions: missions.result.rows });
      }
    }
  }

  async componentWillReceiveProps(props) {
    if (props.car !== this.props.car) {
      this.fetchImage(props);
      this.fetchTrack(props);
      this.stopTrackPlaying();
      this.setState({ trackPaused: 'stopped' });
    }
    if (props.car.id !== this.props.car.id) {
      const carsList = this.props.flux.getStore('objects').state.carsList;
      const car = _.find(carsList, car => car.gov_number === this.props.car.car.gov_number);
      if (car) {
        const car_id = car.asuods_id;
        const missions = await this.props.flux.getActions('missions').getMissionsByCarAndDates(car_id, this.state.from_dt, this.state.to_dt, true, 1);
        this.setState({ missions: missions.result.rows });
      }
    }
  }

  componentWillUnmount() {
    const track = this.props.car.marker.track;
    track.onUpdate();
    this.stopTrackPlaying();
  }

  toggleTrackPlaying() {
    const { marker } = this.props.car;
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

  renderModel() {
    const { imageUrl, trackingMode } = this.state;
    const { car } = this.props;

    const title = ''; // должен быть model title
    const marker = car.marker;
    const isTrackLoaded = marker.hasTrackLoaded();

    const trackBtnClass = 'toggle-tracking-mode btn-sm btn track-btn ' + (trackingMode ? 'tracking' : 'btn-default');
    const trackBtnIconClass = 'glyphicon glyphicon-screenshot ' + (trackingMode ? 'tracking-animate' : '');
    const zoomToTrackClass = 'zoom-to-track-extent btn-sm btn ' + (isTrackLoaded ? 'btn-default' : 'btn-disabled');

    return (
      <Panel title={title}>
        <button disabled={this.state.trackPaused !== 'stopped'} className={trackBtnClass} onClick={this.toggleCarTracking.bind(this)} title="Следить за машиной">
          <span className={trackBtnIconClass} />&nbsp;{trackingMode ? 'Следим' : 'Следить'}
        </button>
        <button disabled={this.state.trackPaused !== 'stopped'} className={zoomToTrackClass} onClick={isTrackLoaded && this.zoomToTrack.bind(this)} title="Показать трек">
          <span className="glyphicon glyphicon-resize-full" />&nbsp;Трек
        </button>
        <img className="car-info-image" src={imageUrl ? config.images + imageUrl : ''} />
        <VehicleAttributes vehicle={car} lastPoint={marker.hasTrackLoaded() && marker.track.getLastPoint()} />
        {marker.track.getLegend()}
      </Panel>
    );
  }

  renderData() {
    const store = this.store;
    const marker = this.props.car.marker;
    const tillNow = this.state.tillNow;
    const reloadBtnCN = 'glyphicon glyphicon-repeat ' + (tillNow && marker.hasTrackLoaded() ? 'tracking-animate' : '');

    const showGradient = store.state.showTrackingGradient;

    return (
      <div className="car-info-tracking">
        <Panel title="Трекинг" className="chart-datepickers-wrap">
          <DatePicker onChange={date => this.setState({ from_dt_: date })}
            date={this.state.from_dt_} disabled={tillNow} ref="from_dt"
          />&nbsp;–&nbsp;
          <DatePicker onChange={date => this.setState({ to_dt_: date })}
            date={this.state.to_dt_} disabled={tillNow} ref="to_dt"
          />
          {/* <label className="gradient-checkbox">
            <input type="checkbox" checked={showGradient} ref="showGradient" onChange={this.onShowGradientChange.bind(this)}/> С градиентом
          </label>*/}
          <label className="till-now-checkbox">
            <input type="checkbox" checked={tillNow} ref="tillNow" onChange={this.onTillNowChange.bind(this)} /> За сегодня
          </label>

          <Button title="Перезагрузить данные"
            className="reload-button"
            onClick={this.fetchVehicleData.bind(this)}
            disabled={tillNow}
          >
            <span className={reloadBtnCN} />
          </Button>

          <div className="track-player">
            <Button onClick={this.toggleTrackPlaying.bind(this)}><Glyphicon glyph={this.state.trackPaused ? 'play' : 'pause'} /></Button>
            <Button disabled={this.state.trackPaused === 'stopped'} onClick={this.stopTrackPlaying.bind(this)}><Glyphicon glyph={'stop'} /></Button>
          </div>

          {this.state.trackPaused !== 'stopped' && <dl className="car-info-play-info">
            <dt>Координаты:</dt>
            <dd>{parseFloat(marker.currentCoords[0]).toFixed(5)}, {parseFloat(marker.currentCoords[1]).toFixed(5)}</dd>
            <dt>Время:</dt>
            <dd>{makeDateFromUnix(marker.currentTime)}</dd>
            <dt>Скорость:</dt>
            <dd>{marker.currentSpeed}</dd>
          </dl>}
        </Panel>
      </div>
    );
  }

  renderMissions() {
    let { missions = [] } = this.state;
    let missionsRender = (<div style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {missions.map((mission) => {
        return (<span
          key={mission.id}
          onClick={this.setMissionById.bind(this, mission.id)}
          style={{ whiteSpace: 'nowrap', display: 'block', cursor: 'pointer' }}
        >
          {`№${mission.number} - ${mission.technical_operation_name}`}
        </span>);
      })}
    </div>);

    if (!missions.length) missionsRender = 'Нет данных';

    return (
      <div className="car-info-tracking">
        <Panel title="Задания" className="chart-datepickers-wrap">
          {missionsRender}
        </Panel>
        <MissionFormWrap onFormHide={() => this.setState({ showMissionForm: false })}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
        />
      </div>
    );
  }

  render() {
    const car = this.props.car;

    if (!car) {
      return null;
    }

    const marker = this.props.car.marker;
    const plate = car.car.gov_number;

    return (
      <div className="car-info" key={marker.id}>
        <h3 className="car-info-plate">{plate}</h3>
        {this.renderModel()}
        {this.renderData()}
        {this.renderMissions()}
        {/* <FuelChart from={this.state.from_dt} to={this.state.to_dt} id={car.id}/>*/}
        {/* <SpeedChart track={marker.hasTrackLoaded() && marker.track}/>*/}
      </div>
    );
  }
}
