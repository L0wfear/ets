import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';
import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import {
  DisplayFlexAlignCenter,
} from 'global-styled/global-styled';
import {
  ReportHeaderWrap,
} from 'components/reports/styled';
import Div from 'components/ui/Div';

const DatePickerBindable: any = bindable(DatePicker);

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
          <ReportHeaderWrap>
            <Div className="datepicker-range-period">
              <Div>
                <label htmlFor=" ">Период формирования</label>
              </Div>
              <DisplayFlexAlignCenter>
                <Div className="inline-block reports-date">
                  <DatePickerBindable
                    date={date_from}
                    onChange={this.props.handleChange}
                    bindOnChange={'date_from'}
                    disabled={readOnly}
                  />
                </Div>
                <Div className="inline-block reports-date">
                  <DatePickerBindable
                    date={date_to}
                    onChange={this.props.handleChange}
                    bindOnChange={'date_to'}
                    disabled={readOnly}
                  />
                </Div>
                <Button
                  disabled={this.props.readOnly}
                  onClick={this.handleSubmit}
                >Сформировать отчёт</Button>
              </DisplayFlexAlignCenter>
            </Div>
          </ReportHeaderWrap>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(MissionProgressReportHeader);
