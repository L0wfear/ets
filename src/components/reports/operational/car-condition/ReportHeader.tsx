import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import Div from 'components/ui/Div';
import { getDatesByShift, createValidDate } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePickerBindable: any = bindable(DatePicker);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  start_date: string;
  end_date: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  handleSubmit = () => {
    const timeShift = getDatesByShift();
    const {
      start_date = timeShift[0],
      end_date = timeShift[1],
    } = this.props;

    this.props.onClick({
      start_date: createValidDate(start_date),
      end_date: createValidDate(end_date),
    });
  }
  render() {
    const timeShift = getDatesByShift();
    const {
      start_date = timeShift[0],
      end_date = timeShift[1],
      readOnly,
    } = this.props;

    return (
      <Row>
        <Col mdOffset={3} md={6} className="datepicker-range">
          <Div className="inline-block faxogramms-date">
            <DatePickerBindable
              date={start_date}
              onChange={this.props.handleChange}
              bindOnChange={'start_date'}
              disabled={readOnly}
              time={false}
            />
          </Div>
          <Div className="date-divider">—</Div>
          <Div className="inline-block faxogramms-date">
            <DatePickerBindable
              date={end_date}
              onChange={this.props.handleChange}
              bindOnChange={'end_date'}
              disabled={readOnly}
              time={false}
            />
          </Div>
        </Col>
        <Col md={3}>
          <Button
            bsSize="small"
            disabled={readOnly}
            onClick={this.handleSubmit}
          >Сформировать отчёт</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
