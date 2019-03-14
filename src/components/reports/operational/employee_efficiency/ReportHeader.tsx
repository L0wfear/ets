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
import Div from 'components/ui/Div';
import {
  DisplayFlexAlignCenter,
} from 'global-styled/global-styled';
import {
  ReportHeaderWrap,
} from 'components/reports/styled';

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
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
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
        <Col md={12}>
          <ReportHeaderWrap>
            <Div className="datepicker-range-period">
              <Div><label htmlFor=" ">Период формирования</label></Div>
              <DisplayFlexAlignCenter>
                <Div className="inline-block reports-date">
                  <DatePickerBindable
                    date={date_start}
                    onChange={this.props.handleChange}
                    bindOnChange={'date_start'}
                    disabled={readOnly}
                  />
                </Div>
                <Div className="inline-block reports-date">
                  <DatePickerBindable
                    date={date_end}
                    onChange={this.props.handleChange}
                    bindOnChange={'date_end'}
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

export default ReportHeaderWrapper(ReportHeader);
