import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday859am, getYesterday9am } from 'utils/dates';

// TODO поправить на получение типов из специального сервиса

class BrigadeEfficiencyReportHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      companyOptions: [],
      selectedCompany: null,
    };
  }

  componentWillMount() {
    const { flux } = this.context;
    const user = flux.getStore('session').getCurrentUser();
    const companyOptions = [{ value: user.company_id, label: user.company_name }];
    this.setState({ companyOptions });
  }

  handleGeozoneTypeChange(v) {
    this.props.handleChange('object_type', v);
    this.props.handleChange('date_start', getYesterday9am());
    this.props.handleChange('date_end', getToday859am());
  }

  render() {
    const props = this.props;
    const { companyOptions } = this.state;
    let { object_type, company_id = null, date_start, date_end } = this.props;
    const OBJECTS = [{ value: 'odh', label: 'Объект дорожного хозяйства' }, { value: 'dt', label: 'Дворовая территория' }];
    return (
      <Div>
        <Row>
          <Col md={4}>
            <Field type="select"
              label="Объекты"
              options={OBJECTS}
              value={object_type}
              onChange={this.handleGeozoneTypeChange.bind(this)}
              clearable={false}
            />
          </Col>
          <Col md={4}>
            <Div><label>Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <Datepicker date={date_start} onChange={props.handleChange.bind(null, 'date_start')} />
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker date={date_end} onChange={props.handleChange.bind(null, 'date_end')} />
            </Div>
          </Col>
          {/* <Col md={3} className={'vehicle-types-container'}>
            <Field type="select"
            label="Учреждение"
            options={companyOptions}
            value={company_id}
            onChange={this.props.handleChange.bind(null, 'company_id')}
            />
          </Col> */}
          <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
            <Button bsSize="small" onClick={props.onClick.bind(this)}>Сформировать отчет</Button>
          </Col>
        </Row>

      </Div>
    );
  }

}

BrigadeEfficiencyReportHeader.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(BrigadeEfficiencyReportHeader, ['objects']);
