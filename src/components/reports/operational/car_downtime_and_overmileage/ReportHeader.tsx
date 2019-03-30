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
  start_date: string;
  end_date: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  handleSubmit = () => {
    const {
      start_date = getToday9am(),
      end_date = getTomorrow9am(),
    } = this.props;

    this.props.onClick({
      start_date: createValidDate(start_date),
      end_date: createValidDate(end_date),
    });
  }
  render() {
    const {
      readOnly,
      start_date = getToday9am(),
      end_date = getTomorrow9am(),
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
            date_start_id="start_date"
            date_start_value={start_date}
            date_start_time={false}
            date_end_id="end_date"
            date_end_value={end_date}
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
