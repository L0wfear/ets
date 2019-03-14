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
import { getDatesByShift, createValidDateTime } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import {
  ReportHeaderWrap,
} from 'components/reports/styled';

const DatePickerBindable: any = bindable(DatePicker);

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
        <Col md={12}>
          <ReportHeaderWrap>
            <Div className="datepicker-range">
              <Div className="inline-block faxogramms-date">
                <DatePickerBindable
                  date={mission_date_start_from}
                  onChange={this.props.handleChange}
                  bindOnChange={'mission_date_start_from'}
                  disabled={readOnly}
                />
              </Div>
              <Div className="date-divider">—</Div>
              <Div className="inline-block faxogramms-date">
                <DatePickerBindable
                  date={mission_date_end_to}
                  onChange={this.props.handleChange}
                  bindOnChange={'mission_date_end_to'}
                  disabled={readOnly}
                />
              </Div>
            </Div>
            <Button
              bsSize="small"
              disabled={readOnly}
              onClick={this.handleSubmit}
            >Сформировать отчёт</Button>
          </ReportHeaderWrap>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
