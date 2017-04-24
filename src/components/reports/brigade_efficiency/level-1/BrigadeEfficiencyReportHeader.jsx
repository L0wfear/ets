import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday859am, getYesterday9am } from 'utils/dates';
import { bindable } from 'utils/decorators';

const DatePicker = bindable(Datepicker);

// TODO поправить на получение типов из специального сервиса
const OBJECTS = [{ value: 'odh', label: 'Объект дорожного хозяйства' }, { value: 'dt', label: 'Дворовая территория' }];


class BrigadeEfficiencyReportHeader extends React.Component {

  handleGeozoneTypeChange = (v) => {
    this.props.handleChange('object_type', v);
    this.props.handleChange('date_start', getYesterday9am());
    this.props.handleChange('date_end', getToday859am());
  }

  render() {
    const { object_type, date_start, date_end } = this.props;
    return (
      <Div>
        <Row>
          <Col md={4}>
            <Field
              type="select"
              label="Объекты"
              options={OBJECTS}
              value={object_type}
              onChange={this.handleGeozoneTypeChange}
              clearable={false}
              readOnly={this.props.readOnly}
            />
          </Col>
          <Col md={4}>
            <Div><label htmlFor=" ">Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <DatePicker
                date={date_start}
                onChange={this.props.handleChange}
                disabled={this.props.readOnly}
                bindOnChange={'date_start'}
              />
            </Div>
            <Div className="inline-block reports-date">
              <DatePicker
                date={date_end}
                onChange={this.props.handleChange}
                disabled={this.props.readOnly}
                bindOnChange={'date_end'}
              />
            </Div>
          </Col>
          <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
            {!this.props.readOnly && <Button bsSize="small" onClick={this.props.onClick}>Сформировать отчет</Button>}
          </Col>
        </Row>
      </Div>
    );
  }

}

BrigadeEfficiencyReportHeader.propTypes = {
  handleChange: React.PropTypes.func,
  onClick: React.PropTypes.func,
  readOnly: React.PropTypes.bool,
  object_type: React.PropTypes.string,
  date_start: React.PropTypes.instanceOf(Date),
  date_end: React.PropTypes.instanceOf(Date),
};

BrigadeEfficiencyReportHeader.defaultProps = {
  readOnly: false,
};

export default BrigadeEfficiencyReportHeader;
