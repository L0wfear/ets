import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import { getDatesByShift, createValidDate } from 'utils/dates';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

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
        <Col mdOffset={3} md={6}>
          <DatePickerRange
            date_start_id="start_date"
            date_start_value={start_date}
            date_start_time={false}
            date_end_id="end_date"
            date_end_value={end_date}
            date_end_time={false}

            onChange={this.props.handleChange}
          />
        </Col>
        <Col md={3}>
          <Button
            block
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
