import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import find from 'lodash/find';
import { Button, Glyphicon } from 'react-bootstrap';
import { makeDateFromUnix, getStartOfToday } from 'utils/dates';
import Panel from 'components/ui/Panel.jsx';
import DatePicker from 'components/ui/DatePicker.jsx';
import cx from 'classnames';
// import SpeedChart from 'components/ui/charts/SpeedChart.jsx';
import config from '../../config.js';
import MissionFormWrap from '../missions/mission/MissionFormWrap.jsx';
import VehicleAttributes from './VehicleAttributes.jsx';

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
        const missions = await flux.getActions('missions').getMissionsByCarAndDates(car_id, this.state.from_dt, this.state.to_dt, true, 1);
        this.setState({ missions: missions.result.rows, car });
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
        const missions = await this.props.flux.getActions('missions').getMissionsByCarAndDates(car_id, this.state.from_dt, this.state.to_dt, true, 1);
        this.setState({ missions: missions.result.rows, car });
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
    const model_id = car.car.model_id;
    const type_id = car.car.type_id;
    flux.getActions('cars').getCarImage(car.id, type_id, model_id).then(url => this.setState({ imageUrl: url }));
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

  renderModel() {
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
        <VehicleAttributes point={car} car={this.state.car} lastPoint={marker.hasTrackLoaded() && marker.track.getLastPoint()} />
        {marker.track.getLegend()}
      </Panel>
    );
  }

  renderData() {
    const marker = this.props.car.marker;
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

          <div className="track-player">
            <Button onClick={this.toggleTrackPlaying}><Glyphicon glyph={this.state.trackPaused ? 'play' : 'pause'} /></Button>
            <Button disabled={this.state.trackPaused === 'stopped'} onClick={this.stopTrackPlaying}><Glyphicon glyph={'stop'} /></Button>
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
    const { missions = [] } = this.state;
    let missionsRender = (
      <div style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {missions.map(mission =>
          <span
            key={mission.id}
            onClick={this.setMissionById.bind(this, mission.id)}
            style={{ whiteSpace: 'nowrap', display: 'block', cursor: 'pointer' }}
          >
            {`№${mission.number} - ${mission.technical_operation_name}`}
          </span>
        )}
      </div>
    );

    if (!missions.length) missionsRender = 'Нет данных';

    return (
      <div className="car-info-tracking">
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

  render() {
    const { car } = this.props;

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
        {/* <SpeedChart track={marker.hasTrackLoaded() && marker.track} />*/}
      </div>
    );
  }
}
