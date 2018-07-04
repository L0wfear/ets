import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePickerBindable: any = bindable(DatePicker);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_from: string;
  date_to: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  handleSubmit = () => {
    const {
      date_from = getToday9am(),
      date_to = getTomorrow9am(),
    } = this.props;

    this.props.onClick({
      date_from: createValidDateTime(date_from),
      date_to: createValidDateTime(date_to),
    });
  }
  render() {
    const {
      readOnly,
      date_from = getToday9am(),
      date_to = getTomorrow9am(),
    } = this.props;

    return (
      <Row className="report-page__header">
        <Col md={12}>
          <label>Период формирования</label>
        </Col>
        <Col md={10}>
          <Row>
            <Col md={3}>
              <DatePickerBindable
                date={date_from}
                onChange={this.props.handleChange}
                bindOnChange={'date_from'}
                disabled={readOnly}
              />
            </Col>
            <Col md={3}>
              <DatePickerBindable
                date={date_to}
                onChange={this.props.handleChange}
                bindOnChange={'date_to'}
                disabled={readOnly}
              />
            </Col>
            <Col md={3}>
              <Button block
                disabled={this.props.readOnly}
                onClick={this.handleSubmit}
              >Сформировать отчёт</Button>
            </Col>

          </Row>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
