import React, { Component } from 'react';
import Panel from './Panel.jsx';
import { getModelById } from '../models.js';
import { getStatusById } from '../statuses.js';
import { getTypeById } from '../types.js';
import { getOwnerById } from '../owners.js';
import { getCustomerById } from '../customers.js';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
//import FuelChart from './FuelChart.js';
import config from '../config.js';
import { Sparklines, SparklinesBars, SparklinesLine, SparklinesNormalBand, SparklinesReferenceLine, SparklinesSpots } from 'sparklines';


class CarInfo extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      imageUrl: null
    };
  }

  componentDidMount() {
    if (this.props.car && !this.state.imageUrl) {
      this.fetchImage();
      this.fetchFuelData();
    }
  }

  render() {
    let car = this.props.car;

    if (!car) {
      return null;
    }

    let plate = car.car.gov_number;

    return (
      <div>
        <h3 style={{ fontWeight: 200, textAlign: 'center' }}>{plate}</h3>
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

    // TODO убрать стили в css
    let isTrackingMode =  this.props.flux.getStore('points').state.trackingMode;
    let trackBtnClass = 'btn-sm btn ' + (isTrackingMode ? 'btn-success' : 'btn-default');
    let trackBtnIconClass = 'glyphicon glyphicon-screenshot ' + (isTrackingMode ? 'tracking-animate' : '');
    let trackBtnStyle = {
      position: 'absolute',
      right: 14,
      top: 8,
      padding: '4px 7px',
      paddingRight: 11,
      width:83,
      textAlign: 'center'
    }

    let zoomToTrackClass = 'btn-sm btn ' + (this.props.car.track === null ? 'btn-disabled' : 'btn-default');
    let zoomToTrackStyle = {
      position: 'absolute',
      right: 14,
      top: 40,
      padding: '4px 7px'
    }
    let isTrackLoaded = car.track !== null && car.track.length > 0;

    return (
      <Panel title={title}>
        { car.status !== 4
          &&
          <button className={trackBtnClass}
                  onClick={this.toggleCarTracking.bind(this)}
                  style={trackBtnStyle}
                  title="Следить за машиной"><span className={trackBtnIconClass}></span>&nbsp;{isTrackingMode ? 'Следим' : 'Следить'}</button>}
          <button className={zoomToTrackClass}
                  onClick={isTrackLoaded && this.zoomToTrack.bind(this)}
                  style={zoomToTrackStyle}
                  title="Показать маршрут"><span className="glyphicon glyphicon-resize-full"></span>&nbsp;Маршрут</button>
        {
         imageUrl ?
           <img src={config.backend + config.images + imageUrl} style={{ margin: 10, width: 250 }}/>
           : null
         }
        {this.renderAttrs()}
      </Panel>
    );
  }

  zoomToTrack(){
    let store = this.props.flux.getStore('points');
    store.setTracking( false );

    let track = this.props.car.track;
    let bounds = track;// L.LatLngBounds(track);
  //  let zoom = window.MAP.getBoundsZoom(track, true, [400,50]);
    window.MAP.fitBounds(bounds, {
      paddingBottomRight: [500,50],
      paddingTopLeft: [50,50],
      animate: true
    });

  }


  toggleCarTracking(){
    let store = this.props.flux.getStore('points');
    let isTrackingMode = store.state.trackingMode;
    store.setTracking( !isTrackingMode );
  }

  renderData() {

    // TODO refactor
    let now = new Date();
    let start_of_today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    let DATE_FORMAT = "yyyy-MM-dd HH:mm";
    let TIME_FORMAT = "HH:mm";

    let twoDigits = (v) => v < 10 ? '0'+v : v;
    let makeDate = (date) => date.getFullYear()+'-'+(date.getMonth()+1)+'-'+twoDigits(date.getDate())+' '+twoDigits(date.getHours())+':'+twoDigits(date.getMinutes());

    let _f = makeDate(this.refs.from_dt ? this.refs.from_dt.state.value : start_of_today);
    let _t = makeDate(this.refs.to_dt ? this.refs.to_dt.state.value : now);

    let reloadBtnStyle = {
      padding: '6px 9px',
      height: 34,
      marginTop: -3
    };

    return (
      <div>
        <Panel title="Трекинг" className="chart-datepickers-wrap">
          <DateTimePicker format={DATE_FORMAT} timeFormat={TIME_FORMAT} className="chart-datepicker" defaultValue={start_of_today} ref="from_dt"/> – <DateTimePicker  timeFormat={TIME_FORMAT} format={DATE_FORMAT} ref="to_dt" className="chart-datepicker" defaultValue={now}/>
          &nbsp;<button title="Перезагрузить данные" style={reloadBtnStyle} className="btn btn-default btn-sm" type="button" onClick={this.reloadTrack.bind(this)}><span className="glyphicon glyphicon-repeat"></span></button>
        </Panel>
        {this.renderFuelData(_f, _t)}
      </div>
    );
  }

  renderAttrs(){
    let car = this.props.car.car;
    let props = [];
    let addProp = (key, value) => props.push({key, value});

    if (car.gov_number && car.gov_number.length) addProp('Гос. номер', car.gov_number)
    if (this.props.car.id && this.props.car.id.length) addProp('ID БНСО', this.props.car.id)
    addProp('Статус', getStatusById(this.props.car.status).title)
    if (car.type_id && getTypeById(car.type_id)) addProp( 'Тип техники', getTypeById(car.type_id).title)
    if (car.model_id && getModelById(car.model_id)) addProp('Шасси', getModelById(car.model_id).title)
    if (car.owner_id && getOwnerById(car.owner_id)) addProp('Владелец', getOwnerById(car.owner_id).title);

    return (
      <div style={{padding:'10px 0', borderTop:'1px solid #ddd', margin: '0 5px'}}>
        {props.map(
            p =>
              <div style={{ textAlign: 'left', fontWeight: 200, color:'#666'}}>{p.key}: <span style={{color:'black', /*fontSize: 16*/}}>{p.value}</span>
              </div>)}
      </div>
    )
  }


  renderFuelData(from, to){

    let FUEL_DATA = [];
    if ( this.state.fuelData ){
      this.state.fuelData.forEach( function (d ){
        FUEL_DATA.push ( d[1])
      });
    }

    return (
      <Panel title="График уровня топлива">
        { FUEL_DATA.length > 0  ?
          <div style={{fontSize:'10px'}}>
            <Sparklines data={FUEL_DATA} width={400} height={90} margin={6} style={{marginBottom:'10px'}}>
              <SparklinesLine style={{ strokeWidth: 1, stroke: "orange", fill: "orange" , fillOpacity:'0.25'}} />
            </Sparklines>
            <span style={{position: 'absolute', left: '10px', transform: 'rotate(-90deg)', top: '46px'}}>% топлива</span>
            <span style={{position:'absolute',left:'47px',bottom:'5px'}}>{from}</span>
            <span style={{position:'absolute',right:'42px',bottom:'5px'}}>{to}</span>
          </div>
          : <span> Нет данных </span>
        }
      </Panel>
    )
  }

  reloadTrack() {

    let makeUTCDate = (date) => new Date(Date.UTC(
      date.getFullYear(), date.getMonth(), date.getDate(), date.getUTCHours(), date.getUTCMinutes()));

    let refs = this.refs;
    let from = makeUTCDate(refs.from_dt.state.value);
    let to = makeUTCDate(refs.to_dt.state.value);

    let pointActions = this.props.flux.getActions('points');

    pointActions.updateTrack(from, to);

    // для отрисовки кнопки "маршрут"
    // @TODO remove this
    //this.forceUpdate()

    this.fetchFuelData(from, to);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.car && nextProps.car !== this.props.car) {
      this.fetchImage();
    }
  }

  fetchFuelData(from_dt, to_dt ) {

    let now = new Date();
    let start_of_today = new Date(Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate())
    );

    from_dt = !!from_dt ? from_dt : start_of_today.getTime();
    to_dt = !!to_dt ? to_dt : now.getTime();

    from_dt = Math.floor( from_dt / 1000)
    to_dt = Math.floor( to_dt / 1000)

    fetch( config.backend + '/fuel/'+this.props.car.id+'/?from_dt='+from_dt+'&to_dt='+to_dt)
      .then( r => r.json())
      .then( r => {
        if (r.length === 0 ) return;
        this.setState( {
          fuelData: r
        })
      })
  }

  fetchImage() {
    this.setState({ imageUrl: null });

    const car = this.props.car;

    fetch(config.backend + `/car_image?model_id=${car.car.model_id}&car_id=${car.id}&type_id=${car.car.type_id}`)
      .then(r => r.json())
      .then(r => {
        if (this.props.car === car) {
          this.setState({ imageUrl: r})
        }
      });

  }

}

export default CarInfo;
