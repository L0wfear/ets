import React, { Component } from 'react';
import Panel from 'components/ui/Panel.jsx';
import { Button } from 'react-bootstrap';
import { getStatusById } from 'constants/statuses';
import config from '../../config.js';
import { makeDate, makeTime, getStartOfToday } from 'utils/dates';
import FuelChart from 'components/ui/charts/FuelChart.jsx';
import SpeedChart from 'components/ui/charts/SpeedChart.jsx';
import { getCarImage } from '../../adapter.js';
import { roundCoordinates } from 'utils/geo';
import DatePicker from 'components/ui/DatePicker.jsx';
import { getTypeById } from 'utils/labelFunctions';


class VehicleAttributes extends Component {

  constructor(props) {
    super(props)

    this.state = {
      attributes: [],
    };

  }

  parseProps(props) {
    let vehicle = props.vehicle;
    let car = vehicle.car;

    let attributes = [];
    let addAttribute = (name, value) => {
      if (typeof value !== 'undefined') {
        attributes.push({
          name,
          value
        })
      }
    }

    let makeLastPointString = point => {
      let dt = new Date(point.timestamp * 1000);
      return makeDate(dt) + ' ' + makeTime(dt, true) + ' [' + roundCoordinates(point.coords_msk) + ']';
    }

    addAttribute('Гос. номер', car.gov_number)
    addAttribute('ID БНСО', vehicle.id)
    getStatusById(vehicle.status) && addAttribute('Статус', getStatusById(vehicle.status).title)
    getTypeById(car.type_id) && addAttribute('Тип техники', getTypeById(car.type_id).title)
    //getModelById(car.model_id) && addAttribute('Шасси', getModelById(car.model_id).title)
    //getOwnerById(car.owner_id) && addAttribute('Владелец', getOwnerById(car.owner_id).title);

    if (props.lastPoint) {
      // todo при клике на "последнюю точку" центрировать по координатам
      addAttribute('Последняя точка', makeLastPointString(props.lastPoint))
    } else {
      addAttribute('Последняя точка', makeLastPointString({
        timestamp: vehicle.timestamp,
        coords_msk: vehicle.coords_msk
      }))
    }

    return attributes;
  }

  componentWillReceiveProps(nextProps) {
    this.setState((state, props) => state.attributes = this.parseProps(nextProps));
  }

  renderAttribute({name, value}) {
    return (
      <div key={name} className="vehicle-attributes-list__item">
           {name}: <span className="value">{value}</span>
      </div>)
  }

  render() {
    return (<div className="vehicle-attributes-list">
              {this.state.attributes.map(attribute => this.renderAttribute(attribute))}
            </div>)
  }
}

export default class CarInfo extends Component {

  constructor(props, context) {
    super(props, context);
    this.store = this.props.flux.getStore('points');
    this.state = {
      imageUrl: null,
      trackingMode: false,
      from_dt: getStartOfToday(),
      to_dt: new Date(),
      from_dt_: getStartOfToday(),
      to_dt_: new Date(),
      tillNow: true
    };
  }

  // TODO переместить это на более высокий уровень абстракции
  zoomToTrack() {
    let store = this.store;
    store.setTracking(false);
    this.setState({trackingMode: false})

    let marker = this.props.car.marker;
    let extent = marker.track.getExtent();
    let map = marker.map;
    let view = map.getView();

    view.fit(extent, map.getSize(), { padding: [50, 550, 50, 50] })
  }

  toggleCarTracking() {
    let store = this.store;
    let trackingMode = store.state.trackingMode;
    store.setTracking(!trackingMode);

    this.setState({trackingMode: !trackingMode})
  }

  onTillNowChange() {
    let tillNow = this.state.tillNow;
    let notTillNow = !tillNow;
    let state = {tillNow: notTillNow};

    if (notTillNow) {
      state.from_dt = state.from_dt_ = getStartOfToday();
      state.to_dt = state.to_dt_ = new Date();
    }

    let track = this.props.car.marker.track;
    track.setContinuousUpdating(notTillNow);

    this.setState(state);
    this.fetchTrack();
  }

  onShowGradientChange() {
    let store = this.store;
    let flag = store.state.showTrackingGradient;
    store.handleSetShowGradient(!flag)
  }

  fetchVehicleData() {
    this.setState({from_dt: this.state.from_dt_, to_dt: this.state.to_dt_}, this.fetchTrack)
  }

  fetchImage(props = this.props) {
    let car = props.car;
    let model_id = car.car.model_id;
    let type_id = car.car.type_id;
    getCarImage(car.id, type_id, model_id).then(url => this.setState({imageUrl: url }))
  }

  fetchTrack(props = this.props) {
    let { from_dt, to_dt, tillNow } = this.state;
    let track = props.car.marker.track;

    // обновление инфы о последней точке при обновлении трэка
    track.onUpdate(() => {
      let dt = new Date();
      if (this.state.tillNow) {
        this.setState({ to_dt_: dt}); // обновляем дату "по"
      }
    });

    track.fetch(from_dt, to_dt);
  }

  componentDidMount() {
    if (this.props.car && !this.state.imageUrl) {
      this.fetchImage();
      this.fetchTrack();
    }
  }

  componentWillReceiveProps(props) {
    if (props.car !== this.props.car) {
      this.fetchImage();
      this.fetchTrack(props);
    }
  }

  componentWillUnmount() {
    let track = this.props.car.marker.track;
    track.onUpdate();
  }

  renderModel() {
    const { imageUrl, trackingMode } = this.state;
    const { car } = this.props;

    let title =  ''; // должен быть model title
    let marker = car.marker;
    let isTrackLoaded = marker.hasTrackLoaded();

    let trackBtnClass = 'toggle-tracking-mode btn-sm btn track-btn ' + (trackingMode ? 'btn-success' : 'btn-default');
    let trackBtnIconClass = 'glyphicon glyphicon-screenshot ' + (trackingMode ? 'tracking-animate' : '');
    let zoomToTrackClass = 'zoom-to-track-extent btn-sm btn ' + (isTrackLoaded ? 'btn-default' : 'btn-disabled');

    return (
      <Panel title={title}>
        <button className={trackBtnClass} onClick={this.toggleCarTracking.bind(this)} title="Следить за машиной">
          <span className={trackBtnIconClass}></span>&nbsp;{trackingMode ? 'Следим' : 'Следить'}
        </button>
        <button className={zoomToTrackClass} onClick={isTrackLoaded && this.zoomToTrack.bind(this)} title="Показать маршрут">
          <span className="glyphicon glyphicon-resize-full"></span>&nbsp;Маршрут
        </button>
        <img className="car-info-image" src={imageUrl ? config.images + imageUrl : ''}/>
        <VehicleAttributes vehicle={car} lastPoint={marker.hasTrackLoaded() && marker.track.getLastPoint()}/>
        {marker.track.getLegend()}
      </Panel>
    );
  }

  renderData() {

    let store = this.store;
    let marker = this.props.car.marker;
    let tillNow = this.state.tillNow;
    let reloadBtnCN = 'glyphicon glyphicon-repeat ' + (tillNow && marker.hasTrackLoaded() ? 'tracking-animate' : '');

    let showGradient = store.state.showTrackingGradient;

    return (
      <div className="car-info-tracking">
        <Panel title="Трекинг" className="chart-datepickers-wrap">
          <DatePicker onChange={date => this.setState({ from_dt_: date})}
                      date={this.state.from_dt_} disabled={tillNow} ref="from_dt"/>&nbsp;–&nbsp;
          <DatePicker onChange={date => this.setState({to_dt_: date})}
                      date={this.state.to_dt_} disabled={tillNow} ref="to_dt"/>
          {/*<label className="gradient-checkbox">
             <input type="checkbox" checked={showGradient} ref="showGradient" onChange={this.onShowGradientChange.bind(this)}/> С градиентом
           </label>*/}
          <label className="till-now-checkbox">
            <input type="checkbox" checked={tillNow} ref="tillNow" onChange={this.onTillNowChange.bind(this)}/> За сегодня
          </label>

          <Button title="Перезагрузить данные"
                  className="reload-button"
                  onClick={this.fetchVehicleData.bind(this)}
                  disabled={tillNow}>
            <span className={reloadBtnCN}></span>
          </Button>
        </Panel>
      </div>
    );
  }

  render() {
    let car = this.props.car;

    if (!car) {
      return null;
    }

    let marker = this.props.car.marker;
    let plate = car.car.gov_number;

    return (
      <div className="car-info" key={marker.id}>
        <h3 className="car-info-plate">{plate}</h3>
        {this.renderModel()}
        {this.renderData()}
        {/*<FuelChart from={this.state.from_dt} to={this.state.to_dt} id={car.id}/>*/}
        {/*<SpeedChart track={marker.hasTrackLoaded() && marker.track}/>*/}
      </div>
    );
  }
}
