import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePickerBindable: any = bindable(DatePicker);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      date_start = getToday9am(),
      date_end = getTomorrow9am(),
    } = this.props;

    return {
      date_start,
      date_end,
    };
  }
  handleSubmit = () => {
    const {
      date_start,
      date_end,
    } = this.getState();

    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
    });
  }
  render() {
    const { readOnly } = this.props;

    const {
      date_start,
      date_end,
    } = this.getState();

    return (
      <Row className="report-page__header">
        <Col md={12}>
          <label>Период формирования</label>
        </Col>
        <Col md={12}>
          <Row>
            <Col md={3}>
              <DatePickerBindable
                date={date_start}
                onChange={this.props.handleChange}
                bindOnChange={'date_start'}
                disabled={readOnly}
              />
            </Col>
            <Col md={3}>
              <DatePickerBindable
                date={date_end}
                onChange={this.props.handleChange}
                bindOnChange={'date_end'}
                disabled={readOnly}
              />
            </Col>
            <Col md={2}>
              <Button block
                disabled={this.props.readOnly}
                onClick={this.handleSubmit}
              >Сформировать отчёт</Button>
            </Col>

          </Row>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
