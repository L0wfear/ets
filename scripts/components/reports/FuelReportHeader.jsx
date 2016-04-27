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

class FuelReportHeader extends Component {

  constructor(props) {
    super(props);
  }

  handleFuelTypeChange(v) {
    let data = !isEmpty(v) ? v : null;
    this.props.handleChange('fuel_type_id', data);
  }

  componentDidMount() {
		const { flux } = this.context;
  	flux.getActions('objects').getFuelTypes();
  }

  render() {
    let { fuelTypes = [] } = this.props;
    let props = this.props;

    let FUEL_TYPES = fuelTypes.map(({ID, NAME}) => ({value: ID, label: NAME}));

  	return (
      <Div>
    		<Row>
    			<Col md={9}>
            <Div><label>Период формирования</label></Div>
    				<Div className="inline-block reports-date">
    					<Datepicker time={false} date={ props.date_from } onChange={props.handleChange.bind(null, 'date_from')}/>
    				</Div>
    				<Div className="inline-block reports-date">
    					<Datepicker time={false} date={ props.date_to } onChange={props.handleChange.bind(null, 'date_to')}/>
    				</Div>
    			</Col>
          <Col md={3} className={'fuel-types-container'}>
            <Field type="select"
                   label="Тип топлива"
                   options={FUEL_TYPES}
                   value={props.fuel_type_id}
                   onChange={this.handleFuelTypeChange.bind(this)}/>
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

FuelReportHeader.contextTypes = {
  flux: React.PropTypes.object,
}

export default connectToStores(FuelReportHeader, ['objects']);
