import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import Div from 'components/ui/Div';

const DatePickerBindable: any = bindable(DatePicker);

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
        <Col mdOffset={4} md={4}>
        <Div><label htmlFor=" ">Период формирования</label></Div>
        <Div className="inline-block reports-date">
          <DatePickerBindable
            time={false}
            date={date_start}
            onChange={this.props.handleChange}
            bindOnChange={'date_start'}
            disabled={readOnly}
          />
        </Div>
        <Div className="inline-block reports-date">
          <DatePickerBindable
            time={false}
            date={date_end}
            onChange={this.props.handleChange}
            bindOnChange={'date_end'}
            disabled={readOnly}
          />
        </Div>
        </Col>
        <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
          <Button
            disabled={this.props.readOnly}
            onClick={this.handleSubmit}
          >Сформировать отчёт</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
