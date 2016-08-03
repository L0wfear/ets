import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday859am, getYesterday0am, getYesterday9am, getYesterday2359, getFormattedDateTimeSeconds } from 'utils/dates';
import { getReportNotReadyNotification } from 'utils/notifications';
import { isEmpty } from 'utils/functions';

// TODO поправить на получение типов из специального сервиса
const COMBINATIONS_CAR_TYPES_ODH = [
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
const COMBINATIONS_CAR_TYPES_DT = [
  {
    value: '83',
    label: 'ДКМ (ПУ+ТР)'
  },
  {
    value: '85;84;1',
    label: 'ДКМ (ПМ+ТР), ДКМ (ПМ+ЖР), ПМ'
  },
  {
    value: '82;9;14',
    label: 'ДКМ (ПУ + ПЩ), ПУ, ПУ вак'
  },
  {
    value: '8',
    label: 'ТУ'
  }
];

class CarFuncTypeUsageReportHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      companyOptions: [],
      selectedCompany: null
    };
  }

  handleGeozoneTypeChange(v) {
    this.props.handleChange('geozone_type', v);
    if (v === 'odh') {
      this.props.handleChange('date_start', getYesterday9am());
      this.props.handleChange('date_end', getToday859am());
    } else {
      this.props.handleChange('date_start', getYesterday0am());
      this.props.handleChange('date_end', getYesterday2359());
    }
  }

  componentWillMount() {
		const { flux } = this.context;
    const user = flux.getStore('session').getCurrentUser();
    const companyOptions = [{value: user.company_id, label: user.company_name}];
    this.setState({companyOptions});
  }

  componentDidMount() {
		// const { flux } = this.context;
    // const user = flux.getStore('session').getCurrentUser();
    // const companyOptions = [{value: user.company_id, label: user.company_name}];
    // this.setState({companyOptions});
  }

  render() {
    let props = this.props;
    const { companyOptions } = this.state;
    let { geozone_type, company_id = null, date_start, date_end } = this.props;
    let OBJECTS = [{value: 'odh', label: 'Объект дорожного хозяйства'}, {value: 'dt', label: 'Дворовая территория'}];

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
    			<Col md={4}>
            <Div><label>Период формирования</label></Div>
    				<Div className="inline-block reports-date">
    					<Datepicker date={ date_start } onChange={props.handleChange.bind(null, 'date_start')}/>
    				</Div>
    				<Div className="inline-block reports-date">
    					<Datepicker date={ date_end } onChange={props.handleChange.bind(null, 'date_end')}/>
    				</Div>
    			</Col>
          <Col md={3} className={'vehicle-types-container'}>
            <Field type="select"
                   label="Учреждение"
                   options={companyOptions}
                   value={company_id}
                   onChange={this.props.handleChange.bind(null, 'company_id')}/>
          </Col>
          <Col md={2} style={{marginTop: 28}}>
            <Button bsSize="small" onClick={props.onClick.bind(this)}>Сформировать отчет</Button>
          </Col>
    		</Row>

      </Div>
  	)
  }

}

CarFuncTypeUsageReportHeader.contextTypes = {
  flux: React.PropTypes.object,
}

export default connectToStores(CarFuncTypeUsageReportHeader, ['objects']);
