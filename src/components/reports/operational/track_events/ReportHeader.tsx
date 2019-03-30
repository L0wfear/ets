import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import Div from 'components/ui/Div';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  handleSubmit = () => {
    const {
      date_start = getToday9am(),
      date_end = getTomorrow9am(),
    } = this.props;

    this.props.onClick({
      date_start: createValidDate(date_start),
      date_end: createValidDate(date_end),
    });
  }
  render() {
    const {
      readOnly,
      date_start = getToday9am(),
      date_end = getTomorrow9am(),
    } = this.props;

    return (
      <Row className="report-page__header">
        <Col md={12}>
          <Row>
            <Col mdOffset={3} md={6}>
              <Div><label htmlFor=" ">Период формирования</label></Div>
            </Col>
          </Row>
        </Col>
        <Col mdOffset={3} md={6}>
          <DatePickerRange
            date_start_id="date_start"
            date_start_value={date_start}
            date_start_time={false}
            date_end_id="date_end"
            date_end_value={date_end}
            date_end_time={false}

            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </Col>
        <Col md={3}>
          <Button
            block
            disabled={this.props.readOnly}
            onClick={this.handleSubmit}
          >
            Сформировать отчёт
          </Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
