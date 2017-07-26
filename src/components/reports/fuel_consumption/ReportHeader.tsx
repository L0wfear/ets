import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import Datepicker from 'components/ui/input/DatePicker';
import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePicker: any = bindable(Datepicker);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_from: string;
  date_to: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
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
      date_from: createValidDate(date_from),
      date_to: createValidDate(date_to),
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
          <label>Период формирования</label>
        </Col>
        <Col md={8}>
          <Row>
            <Col md={3}>
              <DatePicker
                date={date_from}
                time={false}
                onChange={this.props.handleChange}
                bindOnChange={'date_from'}
                disabled={readOnly}
              />
            </Col>
            <Col md={3}>
              <DatePicker
                date={date_to}
                time={false}
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
