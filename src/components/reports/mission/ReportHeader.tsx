import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import Datepicker from 'components/ui/DatePicker.jsx';
import Div from 'components/ui/Div.jsx';
import { getDatesByShift, createValidDateTime } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePicker: any = bindable(Datepicker);

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
      <Row>
        <Col md={3} />
        <Col md={6} className="faxogramms-date-range">
          <Div className="inline-block faxogramms-date">
            <DatePicker
              date={mission_date_start_from}
              onChange={this.props.handleChange}
              bindOnChange={'mission_date_start_from'}
              disabled={readOnly}
            />
          </Div>
          <Div className="date-divider">—</Div>
          <Div className="inline-block faxogramms-date">
            <DatePicker
              date={mission_date_end_to}
              onChange={this.props.handleChange}
              bindOnChange={'mission_date_end_to'}
              disabled={readOnly}
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
