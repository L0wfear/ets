import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import {
  getYesterdayYesterday0am,
  createValidDate,
  diffDates,
  getToday0am,
  getYesterday2359,
} from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';

type IPropsReportHeader = {
  date_from: string;
  date_to: string;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper;

const validDateRange = (date_from, date_to): {} => {
  const diffDate = diffDates(date_to, date_from, 'days');
  const diffDateEnd = diffDates(date_to, getToday0am(), 'days');
  const diffDateStart = diffDates(date_from, getToday0am(), 'days');

  let date_start_error = '';
  let date_end_error = '';

  if (diffDate < 0) {
    date_start_error = 'Дата окончания не может быть меньше даты начала';
  }

  if (diffDateStart >= 0) {
    date_start_error = 'При выборе даты периода отчета нельзя выбирать текущие и будущие дни';
  }

  if (diffDateEnd >= 0) {
    date_end_error = 'При выборе даты периода отчета нельзя выбирать текущие и будущие дни';
  }

  if (diffDate >= 10) {
    date_start_error = 'Период формирования отчета не должен превышать 10 суток.';
  }

  return {
    date_start_error,
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
      date_from = getYesterdayYesterday0am(),
      date_to = getYesterday2359(),
    } = nextProps;

    const error = validDateRange(date_from, date_to);

    return {
      error,
    };
  }

  handleSubmit = () => {
    const {
      date_from = getYesterdayYesterday0am(),
      date_to = getYesterday2359(),
    } = this.props;

    this.props.onClick({
      date_from: createValidDate(date_from),
      date_to: createValidDate(date_to),
    });
  };
  render() {
    const {
      readOnly,
      date_from = getYesterdayYesterday0am(),
      date_to = getYesterday2359(),
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
            date_start_error={error.date_start_error}
            date_end_error={error.date_end_error}
            date_start_time={false}
            date_end_id="date_to"
            date_end_value={date_to}
            date_end_time={false}

            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Button
            block
            disabled={this.props.readOnly || Boolean(error.date_end_error || Boolean(error.date_start_error))}
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
