import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { isEmpty } from 'utils/functions';
import map from 'lodash/map';

class FuelReportHeader extends Component {

  constructor(props) {
    super(props);
  }

  handleFuelTypeChange(v) {
    const data = !isEmpty(v) ? v : null;
    this.props.handleChange('fuel_type', data);
  }

  render() {
    const { appConfig } = this.props;
    const props = this.props;

    const FUEL_TYPES = map(appConfig.enums.FUEL_TYPE, (v, k) => ({ value: k, label: v }));

    return (
      <Div>
        <Row>
          <Col md={4} />
          <Col md={5}>
            <Div><label>Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <Datepicker time={false} date={props.date_from} onChange={props.handleChange.bind(null, 'date_from')} />
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker time={false} date={props.date_to} onChange={props.handleChange.bind(null, 'date_to')} />
            </Div>
          </Col>
          <Col md={3} className={'fuel-types-container'}>
            <Field type="select"
              label="Тип топлива"
              options={FUEL_TYPES}
              value={props.fuel_type}
              onChange={this.handleFuelTypeChange.bind(this)}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col md={9} />
          <Col md={3}>
            <Button bsSize="small" onClick={props.onClick.bind(this)}>Сформировать отчет</Button>
          </Col>
        </Row>
      </Div>
    );
  }

}

FuelReportHeader.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(FuelReportHeader, ['objects']);
