import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import { getToday0am, createValidDate } from 'utils/dates';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import { ExtField } from 'components/ui/new/field/ExtField';
import { ButtonSubmit } from './styled/index';

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
        <Col md={3}>
          <ExtField
            type="date"
            date={start_date}
            onChange={this.props.handleChange}
            boundKeys="start_date"
            time={false}
          />
        </Col>
        <Col mdOffset={6} md={3}>
          <ButtonSubmit
            onClick={this.handleSubmit}
          >Сформировать отчёт</ButtonSubmit>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
