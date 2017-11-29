import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import Datepicker from 'components/ui/input/DatePicker';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePicker: any = bindable(Datepicker);

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
        <Col md={8}>
          <Row>
            <Col md={3}>
              <DatePicker
                date={date_start}
                onChange={this.props.handleChange}
                bindOnChange={'date_start'}
                disabled={readOnly}
              />
            </Col>
            <Col md={3}>
              <DatePicker
                date={date_end}
                onChange={this.props.handleChange}
                bindOnChange={'date_end'}
                disabled={readOnly}
              />
            </Col>
            <Col md={3}>
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
