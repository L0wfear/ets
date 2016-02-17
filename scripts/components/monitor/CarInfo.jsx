import React, { Component } from 'react';
import Panel from '../Panel.jsx';
import { getModelById } from '../../models.js';
import { getStatusById } from '../../statuses.js';
import { getTypeById } from '../../types.js';
import { getOwnerById } from '../../owners.js';
//import { getCustomerById } from '../customers.js';
import config from '../../config.js';
import { makeDate, makeTime, getStartOfToday } from '../../utils/dates.js';
import FuelChart from '../ui/charts/FuelChart.jsx';
import SpeedChart from '../ui/charts/SpeedChart.jsx';
import { getCarImage } from '../../adapter.js';
import { roundCoordinates } from '../../utils/geo.js';
import DatePicker from '../ui/DatePicker.jsx';


class VehicleAttributes extends Component {

  constructor(props) {
    super(props)

    this.state = {
      attributes: []
    }

    // key => name mapp
    this.mappings = {}

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
    getModelById(car.model_id) && addAttribute('Шасси', getModelById(car.model_id).title)
    getOwnerById(car.owner_id) && addAttribute('Владелец', getOwnerById(car.owner_id).title);

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

  componentDidMount() {
    if (this.props.car && !this.state.imageUrl) {
      this.fetchImage();
      this.fetchTrack();
    }
  }

  render() {
    let car = this.props.car;

    //console.log('rendering carinfo');

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
        <FuelChart from={this.state.from_dt} to={this.state.to_dt} id={car.id}/>
        {/*<SpeedChart track={marker.hasTrackLoaded() && marker.track}/>*/}
      </div>
      );
  }

  componentWillUnmount() {
    let track = this.props.car.marker.track;
    track.onUpdate();
  }

  renderModel() {
    let car = this.props.car;
    let modelId = car.car.model_id;
    const imageUrl = this.state.imageUrl;

    let model = getModelById(modelId);
    let title = model ? model.title : '';
    let marker = this.props.car.marker;
    let isTrackingMode = this.state.trackingMode;
    let isTrackLoaded = marker.hasTrackLoaded();

    let trackBtnClass = 'toggle-tracking-mode btn-sm btn track-btn ' + (isTrackingMode ? 'btn-success' : 'btn-default');
    let trackBtnIconClass = 'glyphicon glyphicon-screenshot ' + (isTrackingMode ? 'tracking-animate' : '');
    let zoomToTrackClass = 'zoom-to-track-extent btn-sm btn ' + (isTrackLoaded ? 'btn-default' : 'btn-disabled');


    return (
      <Panel title={title}>
        {<button className={trackBtnClass} onClick={this.toggleCarTracking.bind(this)} title="Следить за машиной"><span className={trackBtnIconClass}></span>&nbsp;{isTrackingMode ? 'Следим' : 'Следить'}</button>}
          <button className={zoomToTrackClass} onClick={isTrackLoaded && this.zoomToTrack.bind(this)} title="Показать маршрут"><span className="glyphicon glyphicon-resize-full"></span>&nbsp;Маршрут</button>
        {imageUrl ?
          <img src={config.backend + config.images + imageUrl} style={{
            margin: 10,
            width: 250,
            minHeight: 100
          }}/>
          : null
        }
        <VehicleAttributes vehicle={car} lastPoint={marker.hasTrackLoaded() && marker.track.getLastPoint()}/>
        {marker.track.getLegend()}
      </Panel>
      );
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
      let isTrackingMode = store.state.trackingMode;
      store.setTracking(!isTrackingMode);

      this.setState({trackingMode: !isTrackingMode})
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
      this.fetchTrack()
    }

    onShowGradientChange() {
      let store = this.store;
      let flag = store.state.showTrackingGradient;
      store.handleSetShowGradient(!flag)
    }


    renderData() {

      let store = this.store;
      let marker = this.props.car.marker;
      let reloadBtnStyle = {
        padding: '6px 9px',
        height: 34,
        marginLeft: 5,
        marginTop: -3
      };

      let tillNow = this.state.tillNow;
      let tillNowStyle = {
        position: 'absolute',
        top: -26,
        right: 20,
        fontWeight: 200
      }

      let reloadBtnCN = 'glyphicon glyphicon-repeat ' + (tillNow && marker.hasTrackLoaded() ? 'tracking-animate' : '');

      let showGradientStyle = {
        position: 'absolute',
        top: -26,
        right: 120,
        fontWeight: 200
      };

      let showGradient = store.state.showTrackingGradient;

      return (
        <div>
        <Panel title="Трекинг" className="chart-datepickers-wrap">
           <DatePicker onChange={date => this.setState({ from_dt_: date})}
                      date={this.state.from_dt_} disabled={tillNow} ref="from_dt"/>&nbsp;–&nbsp;
          <DatePicker onChange={date => this.setState({to_dt_: date})}
                      date={this.state.to_dt_} disabled={tillNow} ref="to_dt"/>
          {/*<label style={showGradientStyle}>
             <input type="checkbox" checked={showGradient} ref="showGradient" onChange={this.onShowGradientChange.bind(this)}/> С градиентом
           </label>*/}
           <label style={tillNowStyle}>
             <input type="checkbox" checked={tillNow} ref="tillNow" onChange={this.onTillNowChange.bind(this)}/> За сегодня
           </label>

            <button title="Перезагрузить данные"
                    style={reloadBtnStyle}
                    className="btn btn-default btn-sm"
                    type="button"
                    onClick={this.fetchVehicleData.bind(this)}
                    disabled={tillNow}>
              <span className={reloadBtnCN}></span>
            </button>
        </Panel>
      </div>
        );
    }

    fetchVehicleData() {
      //console.log(' fetching vehicle data')
      this.setState({from_dt: this.state.from_dt_, to_dt: this.state.to_dt_}, this.fetchTrack)
    }

    fetchImage() {
      let car = this.props.car;
      let model_id = car.car.model_id;
      let type_id = car.car.type_id;
      getCarImage(car.id, type_id, model_id).then(url => this.setState({imageUrl: url }))
    }

    fetchTrack() {
      let {from_dt, to_dt, tillNow} = this.state;
      let track = this.props.car.marker.track;

      // обновление инфы о последней точке при обновлении трэка
      track.onUpdate(()=>{
        let dt = new Date();
        if (this.state.tillNow) {
          this.setState({ to_dt_: dt}); // обновляем дату "по"
        }

        //console.log('ontrack update')
      });

      track.fetch(from_dt, to_dt);
    }
  }
