import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday859am, getYesterday9am } from 'utils/dates';

// TODO поправить на получение типов из специального сервиса

class CarFuncTypeUsageReportHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      companyOptions: [],
      selectedCompany: null,
    };

    this.handleCompanyIdChange = props.handleChange.bind(null, 'company_id');
    this.handleStartDateChange = props.handleChange.bind(null, 'date_start');
    this.handleEndDateChange = props.handleChange.bind(null, 'date_end');
    this.handleGeozoneTypeChange = this.handleGeozoneTypeChange.bind(this);
    this.handleSubmit = props.onClick.bind(this);
  }

  componentWillMount() {
    const { flux } = this.context;
    const user = flux.getStore('session').getCurrentUser();
    let companyOptions = [];
    let selectedCompany = null;
    const queryParamCompanuId = this.props.urlQueryParams.company_id;

    if (this.props.isOkrug) {
      companyOptions = user.companies.map(item => ({
        value: item.id,
        label: item.name,
      }));

      // selectedCompany = queryParamCompanuId || null;
    } else {
      companyOptions = [{ value: user.company_id, label: user.company_name }];
      selectedCompany = queryParamCompanuId || user.company_id;
    }

    this.setState({
      companyOptions,
      selectedCompany,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.company_id !== nextProps.company_id) {
      this.setState({
        selectedCompany: nextProps.company_id,
      });
    }
  }

  handleGeozoneTypeChange(v) {
    this.props.handleChange('geozone_type', v);
    this.props.handleChange('date_start', getYesterday9am());
    this.props.handleChange('date_end', getToday859am());
  }

  render() {
    const { companyOptions, selectedCompany } = this.state;
    const { geozone_type, date_start, date_end } = this.props;
    const OBJECTS = [{ value: 'odh', label: 'Объект дорожного хозяйства' }, { value: 'dt', label: 'Дворовая территория' }];

    return (
      <Div>
        <Row>
          <Col md={3}>
            <Field
              type="select"
              label="Объекты"
              options={OBJECTS}
              value={geozone_type}
              onChange={this.handleGeozoneTypeChange}
              clearable={false}
            />
          </Col>
          <Col md={4}>
            <Div><label htmlFor=" ">Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <Datepicker date={date_start} onChange={this.handleStartDateChange} />
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker date={date_end} onChange={this.handleEndDateChange} />
            </Div>
          </Col>
          <Col md={3} className={'vehicle-types-container'}>
            <Field
              type="select"
              label="Организация"
              options={companyOptions}
              value={selectedCompany}
              onChange={this.handleCompanyIdChange}
            />
          </Col>
          <Col md={2} style={{ marginTop: 28 }}>
            <Button bsSize="small" onClick={this.handleSubmit}>Сформировать отчет</Button>
          </Col>
        </Row>

      </Div>
    );
  }

}

CarFuncTypeUsageReportHeader.propTypes = {
  handleChange: React.PropTypes.func,
  onClick: React.PropTypes.func,
  geozone_type: React.PropTypes.string,
  company_id: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  isOkrug: React.PropTypes.bool,
  date_start: React.PropTypes.instanceOf(Date),
  date_end: React.PropTypes.instanceOf(Date),
};

CarFuncTypeUsageReportHeader.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(CarFuncTypeUsageReportHeader, ['objects']);
