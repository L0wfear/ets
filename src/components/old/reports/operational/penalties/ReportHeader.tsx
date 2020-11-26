import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { createValidDateTime, getToday0am, getDateWithMoscowTz } from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';

type IPropsReportHeader = {
  date_from: string;
  date_to: string;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper;

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  
  getState() {
    const {
      date_from = getToday0am(),
      date_to = getDateWithMoscowTz(),
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
  };
  render() {
    const {
      readOnly,
    } = this.props;
    const {
      date_from,
      date_to,
    } = this.getState();

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col mdOffset={3} md={6}>
              <FieldLabel>
                Период формирования
              </FieldLabel>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col mdOffset={3} md={6}>
          <DatePickerRange
            date_start_id="date_from"
            date_start_value={date_from}
            date_end_id="date_to"
            date_end_value={date_to}

            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Button
            block
            disabled={this.props.readOnly}
            onClick={this.handleSubmit}
          >
            Сформировать отчёт
          </EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);