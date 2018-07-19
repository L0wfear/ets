import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import Div from 'components/ui/Div.jsx';

const DatePickerBindable: any = bindable(DatePicker);

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
        <Col mdOffset={2} md={8}>
        <Div><label htmlFor=" ">Период формирования</label></Div>
        <Div className="inline-block reports-date">
          <DatePickerBindable
            date={start_date}
            onChange={this.props.handleChange}
            bindOnChange={'start_date'}
            disabled={readOnly}
          />
        </Div>
        <Div className="inline-block reports-date">
          <DatePickerBindable
            date={end_date}
            onChange={this.props.handleChange}
            bindOnChange={'end_date'}
            disabled={readOnly}
          />
        </Div>
        </Col>
        <Col md={2} style={{ marginTop: 28, textAlign: 'right' }}>
          <Button
            disabled={this.props.readOnly}
            onClick={this.handleSubmit}
          >Сформировать отчёт</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
