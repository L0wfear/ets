import React, { Component } from 'react';
import Panel from './Panel.jsx';
import { getModelById } from '../models.js';
import { getStatusById } from '../statuses.js';
import { getTypeById } from '../types.js';
import { getOwnerById } from '../owners.js';
//import { getCustomerById } from '../customers.js';
import config from '../config.js';
import { makeDate, makeTime, getStartOfToday } from '../utils/dates.js';
import Graph from './ui/Graph.jsx';
import { getCarImage } from '../adapter.js';
import { roundCoordinates } from '../utils/geo.js';
import DatePicker from './ui/DatePicker.jsx';

export default class CarInfo extends Component {

  constructor(props, context) {
    super(props, context);
    this.store = this.props.flux.getStore('points');
    this.state = {
      imageUrl: null,
      trackingMode: false,
      from_dt: getStartOfToday(),
      to_dt: new Date(),
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

    console.log( 'rendering carinfo');

    if (!car) {
      return null;
    }

    let plate = car.car.gov_number;

    return (
      <div className="car-info">
        <h3 className="car-info-plate">{plate}</h3>
        {this.renderModel()}
        {this.renderData()}
        <Graph type="fuel" from={this.state.from_dt} to={this.state.to_dt} id={car.id}/>
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
        { imageUrl ?
          <img src={config.backend + config.images + imageUrl} style={{
            margin: 10,
            width: 250,
            minHeight: 100
          }}/>
          : null
        }
       {this.renderAttrs()}
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

    onTrackUpdatingChange() {
      let tillNow = this.state.tillNow;
      let notTillNow = !tillNow;
      let state = {tillNow: notTillNow};

      if (notTillNow) {
        state.from_dt = getStartOfToday();
        state.to_dt = new Date();
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
          <DatePicker onChange={date => this.setState({from_dt: date})} 
                      date={this.state.from_dt} disabled={tillNow} ref="from_dt"/>&nbsp;–&nbsp;
          <DatePicker onChange={date => this.setState({to_dt: date})} 
                      date={this.state.to_dt} disabled={tillNow} ref="to_dt"/>
          {/* <label style={showGradientStyle}>
             <input type="checkbox" checked={showGradient} ref="showGradient" onChange={this.onShowGradientChange.bind(this)}/> С градиентом
           </label>*/}
           <label style={tillNowStyle}>
             <input type="checkbox" checked={tillNow} ref="tillNow" onChange={this.onTrackUpdatingChange.bind(this)}/> За сегодня
           </label>

            <button title="Перезагрузить данные"
                    style={reloadBtnStyle}
                    className="btn btn-default btn-sm"
                    type="button"
                    onClick={this.fetchTrack.bind(this)}
                    disabled={tillNow}>
              <span className={reloadBtnCN}></span>
            </button>
        </Panel>
      </div>
        );
    }


    renderAttrs() {
      let car = this.props.car.car;
      let marker = this.props.car.marker;
      let track = marker.track;
      let props = [];
      let addProp = (key, value) => props.push({
          key,
          value
        });


      function getLastTrackPoint(track) {
        let lastPoint = track.getLastPoint();
        let dt = new Date(lastPoint.timestamp * 1000);
        return makeDate(dt) + ' ' + makeTime(dt) + ' [' + roundCoordinates(lastPoint.coords_msk) + ']';
      }

      if (car.gov_number && car.gov_number.length) {
        addProp('Гос. номер', car.gov_number)
      }
      if (this.props.car.id && this.props.car.id.length) {
        addProp('ID БНСО', this.props.car.id)
      }

      addProp('Статус', getStatusById(this.props.car.status).title)

      if (car.type_id && getTypeById(car.type_id)) {
        addProp('Тип техники', getTypeById(car.type_id).title)
      }
      if (car.model_id && getModelById(car.model_id)) {
        addProp('Шасси', getModelById(car.model_id).title)
      }
      if (car.owner_id && getOwnerById(car.owner_id)) {
        addProp('Владелец', getOwnerById(car.owner_id).title);
      }

      if (marker.hasTrackLoaded()) {
         if (track.points.length > 0) {
            addProp('Последняя точка',  getLastTrackPoint(track));
         } else {
          addProp('Последняя точка', getLastTrackPoint([
            {
              timestamp: this.props.car.timestamp,
              coords:this.props.car.coords_msk
            }]))
         }
       } else {
         addProp('Последняя точка', 'Получение данных...')
       }

      return (
        <div style={{
          padding: '10px 0',
          borderTop: '1px solid #ddd',
          margin: '0 5px'
        }}>
        {props.map(
          p => <div style={{
              textAlign: 'left',
              fontWeight: 200,
              color: '#666'
            }}>{p.key}: <span style={{
              color: 'black', /*fontSize: 16*/
            }}>{p.value}</span>
              </div>)}
      </div>
        )
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
      track.onUpdate(function() {
        this.forceUpdate()
        console.log('ontrack update')
      }.bind(this));

      track.fetch(from_dt, to_dt);
    }
  }

