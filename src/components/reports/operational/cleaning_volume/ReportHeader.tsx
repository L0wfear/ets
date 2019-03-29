import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';
import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

import { getToday0am, createValidDate } from 'utils/dates';

import { ExtField } from 'components/ui/new/field/ExtField';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  start_date: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      start_date = getToday0am(),
    } = this.props;

    return {
      start_date,
    };
  }

  handleSubmit = () => {
    const {
      start_date,
    } = this.getState();

    this.props.onClick({
      start_date: createValidDate(start_date),
    });
  }
  render() {
    const {
      start_date,
    } = this.getState();

    return (
      <Row>
        <Col mdOffset={6} md={3}>
          <ExtField
            id="start_date"
            type="date"
            time={false}
            label={false}
            date={start_date}
            onChange={this.props.handleChange}
            boundKeys="start_date"
          />
        </Col>
        <Col md={3}>
          <Button
            block
            bsSize="small"
            onClick={this.handleSubmit}
          >Сформировать отчёт</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
