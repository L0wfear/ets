import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import Div from 'components/ui/Div';
import { getToday0am, createValidDate } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePickerBindable: any = bindable(DatePicker);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  start_date: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      start_date = getToday0am(),
    } = this.props;

    return {
      start_date,
    };
  }

  handleSubmit = () => {
    const {
      start_date,
    } = this.getState();

    this.props.onClick({
      start_date: createValidDate(start_date),
    });
  }
  render() {
    const {
      start_date,
    } = this.getState();

    return (
      <Row>
        <Col mdOffset={6} md={6} className="datepicker-range">
          <Div className="inline-block faxogramms-date">
            <DatePickerBindable
              date={start_date}
              onChange={this.props.handleChange}
              bindOnChange={'start_date'}
              time={false}
            />
          </Div>
        </Col>
        <Col md={3}>
          <Button
            bsSize="small"
            onClick={this.handleSubmit}
          >Сформировать отчёт</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
