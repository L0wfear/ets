import React, { Component } from 'react';
import Panel from './Panel.jsx';
import { getModelById } from '../models.js';
import { getStatusById } from '../statuses.js';
import { getTypeById } from '../types.js';
import { getOwnerById } from '../owners.js';
//import { getCustomerById } from '../customers.js';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import config from '../config.js';
import { Sparklines, SparklinesLine } from './Sparklines.js';
import { getTrackColor } from './map/Track.js';
import { makeDate, makeTime, getStartOfToday } from '../helpers/dates.js';

export class Preloader {

  render() {
    return ( // TODO заменить .svg
      <img src="images/infinity.gif" style={this.props.style} alt="Идет загрузка графика топлива"/>
      /* <svg width='120px' height='120px' viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" xmlns:xlink="http://www.w3.org/1999/xlink" class="uil-inf"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><path id="uil-inf-path" d="M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40 C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z" fill="none" stroke="#c0bb9c" stroke-width="1px" stroke-dasharray="5px"></path><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="0s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="0.33s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="0.66s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="1s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="1.33s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle>
       </svg>*/
      )
  }
}

class CarInfo extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      imageUrl: null,
      tillNow: true,
      fuelData: null
    };
  }

  componentDidMount() {
    if (this.props.car && !this.state.imageUrl) {
      this.fetchImage();
    }
  }

  render() {
    let car = this.props.car;

    if (!car) {
      return null;
    }

    let plate = car.car.gov_number;

    return (
      <div className="car-info">
        <h3 style={{
        fontWeight: 200,
        textAlign: 'center'
      }}>{plate}</h3>
        {this.renderModel()}
        {this.renderData()}
      </div>
      );
  }

  renderModel() {
    let car = this.props.car;
    let modelId = car.car.model_id;
    const imageUrl = this.state.imageUrl;

    let model = getModelById(modelId);
    let title = model ? model.title : '';
    let store = this.props.flux.getStore('points');
    let marker = this.props.car.marker;
    let track = marker.track;

    // TODO убрать стили в css
    let isTrackingMode = store.state.trackingMode;

    let trackBtnIconClass = 'glyphicon glyphicon-screenshot ' + (isTrackingMode ? 'tracking-animate' : '');
    let trackBtnIconStyle = {
      backgroundColor: '#eee', //#2ECC40',
      border: '1px solid #ccc',
      borderRadius: 9,
      padding: 2,
      margin: -3,
      marginRight: -1,
      marginLeft: -4,
      color: 'black'
    }

    let trackBtnClass = 'btn-sm btn track-btn ' + (isTrackingMode ? 'btn-success' : 'btn-default');

    let zoomToTrackClass = 'btn-sm btn ' + (track === null ? 'btn-disabled' : 'btn-default');
    let zoomToTrackStyle = {
      position: 'absolute',
      right: 14,
      top: 40,
      padding: '4px 7px'
    }

    //debugger;
    let isTrackLoaded = track !== null && track.points !== null && track.points.length > 0 ;

    return (
      <Panel title={title}>
        {
      <button className={trackBtnClass}
      onClick={this.toggleCarTracking.bind(this)}
      title="Следить за машиной"><span className={trackBtnIconClass} style={trackBtnIconStyle}></span>&nbsp;{isTrackingMode ? 'Следим' : 'Следить'}</button>}
          <button className={zoomToTrackClass}
      onClick={isTrackLoaded && this.zoomToTrack.bind(this)}
      style={zoomToTrackStyle}
      title="Показать маршрут"><span className="glyphicon glyphicon-resize-full"></span>&nbsp;Маршрут</button>
        {
      imageUrl ?
        <img src={config.backend + config.images + imageUrl} style={{
          margin: 10,
          width: 250,
          minHeight: 100
        }}/>
        : null
      }
       {this.renderAttrs()}
        {isTrackLoaded ? this.renderTrackLegend() : null}
      </Panel>
      );
  }


  // todo refactor that shit
  renderTrackLegend() {

    let colors = [];
    let car = this.props.car.car;
    let type_id = car.type_id;
    let prevColor = getTrackColor(0, type_id);

    function addColor(color, speed) {
      if (colors.length > 0) {
        colors[colors.length - 1].till = speed - 1;
      }
      colors.push({
        color: color,
        speed: speed
      })
    }

    addColor(prevColor, 0);

    for (let i = 0, till = 100; i <= till; i++) {
      let color = getTrackColor(i, type_id);
      if (color !== prevColor) {
        addColor(color, i);
        prevColor = color;
      }
    }

    if (colors[colors.length - 1].till === undefined) {
      colors[colors.length - 1].speed = colors[colors.length - 1].speed + '+'
    }


    let legend = colors.map((obj, i) => {

      let text = obj.speed + (obj.till ? ' – ' + obj.till : '') + ' км/ч';
      let color = obj.color;

      return <div className="track-legend-item">
          <div className="track-legend-point" style={{
          backgroundColor: color
        }}></div>
          <div className="track-legend-text">{text}</div>
      </div>
      });

      return (
        <div className="track-legend">
        <p className="track-legend-header">Цвета маршрута:</p>
        {legend}</div>
        )
    }

    // TODO переместить это на более высокий уровень абстракции
    zoomToTrack() {
      let store = this.props.flux.getStore('points');
      store.setTracking(false);

      let track = this.props.car.marker.track
      let extent = track.getExtent();
      let map = this.props.car.marker.map;
      let view = map.getView();

      view.fit(extent, map.getSize(), { padding: [50,550, 50,50] })

    }


    toggleCarTracking() {
      let store = this.props.flux.getStore('points');
      let isTrackingMode = store.state.trackingMode;
      store.setTracking(!isTrackingMode);
    }

    onShowGradientChange() {

      let store = this.props.flux.getStore('points');
      let flag = store.state.showTrackingGradient;
      store.handleSetShowGradient(!flag)

    }

    onTrackingDatesChange() {
      let flag = this.state.tillNow;

      this.setState({
        tillNow: !flag
      }, () => {

        let to = this.refs.to_dt;
        let from = this.refs.from_dt;
        let store = this.props.flux.getStore('points');

        store.toggleSelectedPointTrackUpdating(this.state.tillNow)

        // keeping dates sync
        to.setState({
          value: new Date()
        });
        from.setState({
          value: this.getStartOfToday()
        });

        this.loadTrack()
      });
    }

    renderData() {

      let now = new Date();
      let start_of_today = getStartOfToday();
      let store = this.props.flux.getStore('points');

      let DATE_FORMAT = 'yyyy-MM-dd HH:mm';
      let TIME_FORMAT = 'HH:mm';

      let _f = makeDate(this.refs.from_dt ? this.refs.from_dt.state.value : start_of_today);
      let _t = makeDate(this.refs.to_dt ? this.refs.to_dt.state.value : now);

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

      let toClassname = 'chart-datepicker ' + (tillNow ? 'disabled' : '');

      if (this.state.tillNow) {
        // TODO FIXME
        setTimeout(() => {
          // LOL
          if (!!this.refs.to_dt) {
            this.refs.to_dt.setState({
              value: now
            })
          }
        }, 0)
      }

      let reloadBtnCN = 'glyphicon glyphicon-repeat ' + (this.props.car.track === null ? 'tracking-animate' : '');


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
          <DateTimePicker format={DATE_FORMAT}
        timeFormat={TIME_FORMAT}
        className="chart-datepicker"
        disabled={tillNow}
        defaultValue={start_of_today}
        ref="from_dt"/> –&nbsp;
           <label style={showGradientStyle}>
             <input type="checkbox" checked={showGradient} ref="showGradient" onChange={this.onShowGradientChange.bind(this)}/> С градиентом
           </label>
           <label style={tillNowStyle}>
             <input type="checkbox" checked={tillNow} ref="tillNow" onChange={this.onTrackingDatesChange.bind(this)}/> За сегодня
           </label>

           <DateTimePicker timeFormat={TIME_FORMAT}
        format={DATE_FORMAT}
        ref="to_dt"
        className={toClassname}
        disabled={tillNow}
        defaultValue={now}
        readonly={tillNow} />

            <button title="Перезагрузить данные"
        style={reloadBtnStyle}
        className="btn btn-default btn-sm"
        type="button"
        onClick={this.loadTrack.bind(this)}
        disabled={tillNow}>
              <span className={reloadBtnCN}></span>
            </button>



        </Panel>
        {this.renderFuelData(_f, _t)}
      </div>
        );
    }

    renderAttrs() {
      let car = this.props.car.car;
      let props = [];
      let addProp = (key, value) => props.push({
          key,
          value
        });

      if (car.gov_number && car.gov_number.length) addProp('Гос. номер', car.gov_number)
      if (this.props.car.id && this.props.car.id.length) addProp('ID БНСО', this.props.car.id)
      addProp('Статус', getStatusById(this.props.car.status).title)
      if (car.type_id && getTypeById(car.type_id)) addProp('Тип техники', getTypeById(car.type_id).title)
      if (car.model_id && getModelById(car.model_id)) addProp('Шасси', getModelById(car.model_id).title)
      if (car.owner_id && getOwnerById(car.owner_id)) addProp('Владелец', getOwnerById(car.owner_id).title);

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


    renderFuelData(from, to) {

      let FUEL_DATA = [];
      if (this.state.fuelData) {
        this.state.fuelData.forEach(function(d) {
          FUEL_DATA.push(d[1])
        });
      }


      let rendered = <div> Нет данных </div>;
      if (this.state.fuelData === null) {
        rendered = <Preloader style={{
          height: 103
        }}/>;
      } else if (FUEL_DATA.length > 0) {
        rendered = <div style={{
          fontSize: '10px'
        }}>
                      <Sparklines data={FUEL_DATA} width={400} height={90} margin={6} style={{
          marginBottom: '10px'
        }}>
                        <SparklinesLine style={{
          strokeWidth: 1,
          stroke: 'orange',
          fill: 'orange',
          fillOpacity: '0.25'
        }}/>
                      </Sparklines>
                        <span
        style={{
          position: 'absolute',
          left: '10px',
          transform: 'rotate(-90deg)',
          top: '46px'
        }}>% топлива</span>
                      <span style={{
          position: 'absolute',
          left: '47px',
          bottom: '5px'
        }}>{from}</span>
                      <span style={{
          position: 'absolute',
          right: '42px',
          bottom: '5px'
        }}>{to}</span>
                    </div>
      }

      return (
        <Panel title="График уровня топлива">
        {rendered}
      </Panel>
        )
    }

    fetchPointData() {
      //this.loadTrack()
      this.fetchFuelData()
    }

    loadTrack() {

      return;

      let refs = this.refs;
      let from = refs.from_dt.state.value;
      let to = this.state.tillNow ? Date.now() : refs.to_dt.state.value;

      if (to - from > 24 * 60 * 60 * 1000) {
        global.NOTIFICATION_SYSTEM.notify('Период запроса трэка не может превышать 24 часа', 'warning')
        return;
      }

      let store = this.props.flux.getStore('points');

      this.props.car.track = null;
      //      store.handleUpdateTrack(from, to);

      this.setState({
        fuelData: null
      })
      this.fetchFuelData(from, to);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.car && nextProps.car !== this.props.car) {
        //this.fetchImage();
      }
    }


    // todo move this to API
    fetchFuelData(
      from_dt = getStartOfToday(),
      to_dt = new Date().getTime()) {

      from_dt = Math.floor(from_dt / 1000);
      to_dt = Math.floor(to_dt / 1000);

      fetch(config.backend + '/fuel/' + this.props.car.id + '/?from_dt=' + from_dt + '&to_dt=' + to_dt)
        .then(r => r.json())
        .then(r => {
          this.setState({
            fuelData: r
          })
        })
    }

    fetchImage() {
      this.setState({
        imageUrl: null
      });

      const car = this.props.car;

      fetch(config.backend + `/car_image?model_id=${car.car.model_id}&car_id=${car.id}&type_id=${car.car.type_id}`)
        .then(r => r.json())
        .then(r => {
          if (this.props.car === car) {
            this.setState({
              imageUrl: r
            })
          }
        });

    }

  }

  export default CarInfo;
