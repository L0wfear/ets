import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';
import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';

import { getToday0am, createValidDate } from 'components/@next/@utils/dates/dates';

import { ExtField } from 'components/old/ui/new/field/ExtField';

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
      <EtsBootstrap.Row>
        <EtsBootstrap.Col mdOffset={6} md={3}>
          <ExtField
            id="start_date"
            type="date"
            time={false}
            label={false}
            date={start_date}
            onChange={this.props.handleChange}
            boundKeys="start_date"
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Button
            block
            bsSize="small"
            onClick={this.handleSubmit}
          >Сформировать отчёт</EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
