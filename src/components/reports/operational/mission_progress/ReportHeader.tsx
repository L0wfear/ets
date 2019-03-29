import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';
import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import Div from 'components/ui/Div';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsMissionProgressReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_from: string;
  date_to: string;
}

class MissionProgressReportHeader extends React.Component<IPropsMissionProgressReportHeader, any> {
  getState() {
    const {
      date_from = getToday9am(),
      date_to = getTomorrow9am(),
    } = this.props;

    return {
      date_from,
      date_to,
    };
  }
  handleSubmit = () => {
    const {
      date_from,
      date_to,
    } = this.getState();

    this.props.onClick({
      date_from: createValidDateTime(date_from),
      date_to: createValidDateTime(date_to),
    });
  }
  render() {
    const { readOnly } = this.props;

    const {
      date_from,
      date_to,
    } = this.getState();

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
            date_start_id="date_from"
            date_start_value={date_from}
            date_end_id="date_to"
            date_end_value={date_to}

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

export default ReportHeaderWrapper(MissionProgressReportHeader);
