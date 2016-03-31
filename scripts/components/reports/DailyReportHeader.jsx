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

  componentDidMount() {
		const { flux } = this.context;
  	flux.getActions('objects').getCarFuncTypes();
  }

  render() {
    let props = this.props;
    let OBJECTS = [{value: 'odh', label: 'Объект дорожного хозяйства'}, {value: 'dt', label: 'Дворовая территория'}];
    let ELEMENTS = props.geozone_type === 'odh' ?
      [
        {value: 'roadway', label: 'Проезжая часть'},
        {value: 'footway', label: 'Тротуар'}
      ]
      : [{value: 'yard', label: 'Двор'}];
    let CAR_FUNC_TYPES = props.carFuncTypesList.map(t => ({value: t.id, label: t.full_name}));

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
                   multi={true}
                   options={CAR_FUNC_TYPES}
                   value={props.car_type_id_list}
                   onChange={this.handleCarTypeIdListChange.bind(this)}/>
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
