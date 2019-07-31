import * as React from 'react';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import { getToday0am, createValidDate } from 'utils/dates';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import { ExtField } from 'components/ui/new/field/ExtField';
import { ButtonSubmit } from 'components/reports/operational/cars_count_deviation/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
        <EtsBootstrap.Col md={3}>
          <ExtField
            type="date"
            date={start_date}
            onChange={this.props.handleChange}
            boundKeys="start_date"
            time={false}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col mdOffset={6} md={3}>
          <ButtonSubmit
            onClick={this.handleSubmit}
          >Сформировать отчёт</ButtonSubmit>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
