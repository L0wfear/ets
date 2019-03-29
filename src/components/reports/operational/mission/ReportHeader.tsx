import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import Div from 'components/ui/Div';
import { getDatesByShift, createValidDateTime } from 'utils/dates';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  mission_date_start_from: string;
  mission_date_end_to: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  handleSubmit = () => {
    const timeShift = getDatesByShift();
    const {
      mission_date_start_from = timeShift[0],
      mission_date_end_to = timeShift[1],
    } = this.props;

    this.props.onClick({
      mission_date_start_from: createValidDateTime(mission_date_start_from),
      mission_date_end_to: createValidDateTime(mission_date_end_to),
    });
  }
  render() {
    const timeShift = getDatesByShift();
    const {
      mission_date_start_from = timeShift[0],
      mission_date_end_to = timeShift[1],
      readOnly,
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
            date_start_id="mission_date_start_from"
            date_start_value={mission_date_start_from}
            date_end_id="mission_date_end_to"
            date_end_value={mission_date_end_to}

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
