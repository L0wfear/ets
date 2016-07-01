import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Div from '../ui/Div.jsx';
import Field from '../ui/Field.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import { getToday859am, getYesterday0am, getYesterday9am, getYesterday2359, getFormattedDateTimeSeconds } from 'utils/dates';
import { getReportNotReadyNotification } from 'utils/notifications';
import { isEmpty } from 'utils/functions';

const COMBINATIONS_CAR_TYPES = [
  {
    value: '84, 85, 1',
    label: 'ДКМ (ПМ+ЖР), ДКМ (ПМ+ТР), ПМ'
  },
  {
    value: '82, 9, 14',
    label: 'ДКМ (ПУ+ПЩ), ПУ, ПУвак'
  },
  {
    value: '8',
    label: 'ТУ'
  }
];

class DailyReportHeader extends Component {

  constructor(props) {
    super(props);
  }

  handleGeozoneTypeChange(v) {
    this.props.handleChange('geozone_type', v);
    if (v === 'odh') {
      this.props.handleChange('element', 'roadway');
      this.props.handleChange('date_start', getYesterday9am());
      this.props.handleChange('date_end', getToday859am());
    } else {
      this.props.handleChange('element', 'yard');
      this.props.handleChange('date_start', getYesterday0am());
      this.props.handleChange('date_end', getYesterday2359());
    }
  }

  handleCarTypeIdListChange(v) {
    let data = !isEmpty(v) ? v.split(',').map(d => parseInt(d, 10)) : [];
    this.props.handleChange('car_type_id_list', data);
  }

  handleCarTypeIdListChangeCombinations(v) {
    this.props.handleChange('car_type_id_list', v.split(', ').map(v => parseInt(v, 10)));
  }

  componentDidMount() {
		const { flux } = this.context;
  	flux.getActions('objects').getTypes();
  }

  render() {
    let props = this.props;
    let { geozone_type, typesList = [], useCombinations = false, car_type_id_list } = this.props;
    let OBJECTS = [{value: 'odh', label: 'Объект дорожного хозяйства'}, {value: 'dt', label: 'Дворовая территория'}];
    let ELEMENTS = geozone_type === 'odh' ?
      [
        {value: 'roadway', label: 'Проезжая часть'},
        {value: 'footway', label: 'Тротуар'}
      ]
      : [{value: 'yard', label: 'Двор'}];
    let CAR_TYPES = typesList.map(t => ({value: t.id, label: t.full_name}));
    if (useCombinations) {
      CAR_TYPES = COMBINATIONS_CAR_TYPES;
    }

    console.log(car_type_id_list);

  	return (
      <Div>
    		<Row>
    			<Col md={3}>
            <Field type="select"
                   label="Объекты"
                   options={OBJECTS}
                   value={props.geozone_type}
                   onChange={this.handleGeozoneTypeChange.bind(this)}
                   clearable={false}/>
    			</Col>
          <Col md={2}>
            <Field type="select"
                   label="Элемент"
                   options={ELEMENTS}
                   disabled={props.geozone_type !== 'odh'}
                   value={props.element}
                   onChange={props.handleChange.bind(null, 'element')}
                   clearable={false}/>
    			</Col>
    			<Col md={4}>
            <Div><label>Период формирования</label></Div>
    				<Div className="inline-block reports-date">
    					<Datepicker date={ props.date_start } onChange={props.handleChange.bind(null, 'date_start')}/>
    				</Div>
    				<Div className="inline-block reports-date">
    					<Datepicker date={ props.date_end } onChange={props.handleChange.bind(null, 'date_end')}/>
    				</Div>
    			</Col>
          <Col md={3} className={'vehicle-types-container'}>
            <Field type="select"
                   label="Типы ТС"
                   multi={!useCombinations}
                   options={CAR_TYPES}
                   value={!useCombinations ? car_type_id_list : car_type_id_list.join(', ')}
                   onChange={!useCombinations ? this.handleCarTypeIdListChange.bind(this) : this.handleCarTypeIdListChangeCombinations.bind(this)}/>
          </Col>
    		</Row>

        <Row style={{marginTop: 20}}>
          <Col md={9}></Col>
          <Col md={3}>
            <Button bsSize="small" onClick={props.onClick.bind(this)}>Сформировать отчет</Button>
          </Col>
        </Row>
      </Div>
  	)
  }

}

DailyReportHeader.contextTypes = {
  flux: React.PropTypes.object,
}

export default connectToStores(DailyReportHeader, ['objects']);
