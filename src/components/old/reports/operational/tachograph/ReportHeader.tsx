import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { createValidDate, getYesterday0am, getToday0am, diffDates } from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';

type IPropsReportHeader = {
  date_from: string;
  date_to: string;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper;

const validDateRange = (date_from, date_to): {} => {

  const diffDateEnd = diffDates(date_from, date_to, 'days');

  let date_end_error = '';

  if (diffDateEnd >= 0) {
    date_end_error = 'Дата окончания периода формирования должна быть больше даты начала';
  }

  return {
    date_end_error,
  };

};

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  state = {
    error: {
      date_start_error: '',
      date_end_error: '',
    },
  };

  static getDerivedStateFromProps(nextProps) {
    const {
      date_from = getYesterday0am(),
      date_to = getToday0am(),
    } = nextProps;

    const error = validDateRange(date_from, date_to);

    return {
      error,
    };
  }

  handleSubmit = () => {
    const {
      date_from = getYesterday0am(),
      date_to = getToday0am(),
    } = this.props;

    this.props.onClick({
      date_from: createValidDate(date_from),
      date_to: createValidDate(date_to),
    });
  };
  render() {
    const {
      date_from = getYesterday0am(),
      date_to = getToday0am(),
      readOnly,
    } = this.props;

    const { error } = this.state;

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
            date_start_time={false}
            date_end_time={false}
            date_end_error={error.date_end_error}
            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Button
            block
            disabled={this.props.readOnly || !!error.date_end_error}
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