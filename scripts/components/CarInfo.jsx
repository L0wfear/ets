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
import { Sparklines, SparklinesBars, SparklinesLine, SparklinesNormalBand, SparklinesReferenceLine, SparklinesSpots } from './Sparklines.js';



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

    let plate = car.car[0];

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
    let modelId = car.car[2];
    const imageUrl = this.state.imageUrl;

    let model = getModelById(modelId);

    var title = model ? model.title : '';
    //title = title + ' (' + car.car[0] +')';

    return (
      <Panel title={title}>
        {
         imageUrl ? <img src={config.backend + config.images + imageUrl}
             style={{ margin: 10, width: 250 }}/> : null
         }
      </Panel>
    );
  }

  renderData() {
    let car = this.props.car;
    let ccar = car.car;

    let props = [];

     if (ccar[0] && ccar[0].length) {
       props.push({
         key: 'Гос. номер',
         value: ccar[0]
       });
     }

    if (car['id'] && car['id'].length) {
      props.push({
        key: 'ID БНСО',
        value: car['id']
      });
    }

    props.push({
      key: 'Статус',
      value: getStatusById(car.status).title
    });

    if (ccar[1] && getTypeById(ccar[1])) {
      props.push({
        key: 'Тип техники',
        value: getTypeById(ccar[1]).title
      });
    }

    if (ccar[2] && getModelById(ccar[2])) {
      props.push({
        key: 'Шасси',
        value: getModelById(ccar[2]).title
      });
    }

    if (ccar[3] && getOwnerById(ccar[3])) {
      props.push({
        key: 'Владелец',
        value: getOwnerById(ccar[3]).title
      });
    }

    if (ccar[4] && getCustomerById(ccar[4])) {
      props.push({
        key: 'Заказчик',
        value: getCustomerById(ccar[4]).title
      });
    }

    let now = new Date();
    let start_of_today = new Date(Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate())
    );

    let twoDigits = (v) => v < 10 ? '0'+v : v;
    let makeDate = (date) => date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+twoDigits(date.getHours())+':'+twoDigits(date.getMinutes());
    let DATE_FORMAT = "yyyy-MM-d HH:mm",
        TIME_FORMAT = "HH:mm",
        _f = this.refs.from_dt ? this.refs.from_dt.state.value : start_of_today,
        _t = this.refs.to_dt ? this.refs.to_dt.state.value : now;

    _f = makeDate(_f);
    _t = makeDate(_t);

    let FUEL_DATA = [];
    this.state.fuelData && this.state.fuelData.forEach( function (d ){
      FUEL_DATA.push ( d[1])
    });

    return (
      <div>
        <Panel title="Трэкинг" className="chart-datepickers-wrap">
          С <DateTimePicker format={DATE_FORMAT} timeFormat={TIME_FORMAT} className="chart-datepicker" defaultValue={start_of_today} ref="from_dt" onChange={this.handleTrackDatesChange.bind(this)}/> по <DateTimePicker  timeFormat={TIME_FORMAT} format={DATE_FORMAT} ref="to_dt" className="chart-datepicker" onChange={this.handleTrackDatesChange.bind(this)} defaultValue={now}/>
        </Panel>
        <Panel title="Данные">
          {props.map(p =>
          <div style={{ textAlign: 'left', fontWeight: 200}}>{p.key}: <span style={{color:'#666', fontSize: 15}}>{p.value}</span>

          </div>)}
        </Panel>
        <Panel title="График расхода топлива" ref="fuel_chart">
          { FUEL_DATA.length > 0  ?
            <div style={{fontSize:'10px'}}>
              <Sparklines data={FUEL_DATA} width={400} height={90} margin={6} style={{marginBottom:'10px'}}>
                <SparklinesLine style={{ strokeWidth: 1, stroke: "orange", fill: "orange" , fillOpacity:'0.25'}} />
              </Sparklines>
              <span style={{position: 'absolute', left: '10px', transform: 'rotate(-90deg)', top: '46px'}}>% топлива</span>
              <span style={{position:'absolute',left:'47px',bottom:'5px'}}>{_f}</span>
              <span style={{position:'absolute',right:'42px',bottom:'5px'}}>{_t}</span>
            </div>
            : <span> Нет данных </span>
          }
        </Panel>
      </div>
    );
  }

  handleTrackDatesChange(){
    let refs = this.refs;
    let from = refs.from_dt.state.value;
    let to = refs.to_dt.state.value;

    window.handleUpdateTrack(from, to);

    this.fetchFuelData(from, to);
    this.props.updateTrack();
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

    fetch(config.backend + `/car_image?model_id=${car.car[2]}&car_id=${car.id}&type_id=${car.car[1]}`)
      .then(r => r.json())
      .then(r => {
        if (this.props.car === car) {
          this.setState({ imageUrl: r})
        }
      });

  }

}

export default CarInfo;
