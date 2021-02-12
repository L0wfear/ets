import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getToday9am, getTomorrow9am, createValidDateTime, diffDates } from 'components/@next/@utils/dates/dates';
import ExtField from 'components/@next/@ui/renderFields/Field';
import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { isNullOrUndefined } from 'util';

type IPropsReportHeader = {
  date_start: string;
  date_end: string;
  car: string;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper & StateProps;
type StateProps = {
  userData: InitialStateSession['userData'];
};
const validDateRange = (date_start, date_end, {company_id, isOkrug}: {company_id: number; isOkrug: boolean;}): {} => {
  const diffDatesMonths = Math.ceil(diffDates(date_end, date_start, 'months'));
  const isCompany = !isNullOrUndefined(company_id);
  const isGlobalUser = !isOkrug && !isCompany;
  const diffDatesDays = diffDates(date_end, date_start, 'days');
  console.info(isCompany);
  const date_start_error = isGlobalUser && diffDatesMonths > 3
    ? 'Период формирования отчета не должен превышать 3 месяца'
    : isOkrug && diffDatesMonths > 6
      ? 'Период формирования отчета не должен превышать 6 месяцев'
      : isCompany && diffDatesMonths > 12
        ? 'Период формирования отчета не должен превышать 1 год'
        : diffDatesDays <= 0
          ? 'Дата окончания периода должна быть позже даты начала'
          : '';

  return {
    date_start_error,
  };

};

class ReportHeader extends React.Component<IPropsReportHeader, {error: {date_start_error: string;};}> {
  state = {
    error: {
      date_start_error: ''
    }
  };
  getState() {
    const {
      date_start = getToday9am(),
      date_end = getTomorrow9am(),
      car = 'all',
    } = this.props;

    return {
      date_start,
      date_end,
      car,
    };
  }
  static getDerivedStateFromProps(nextProps) {
    const {
      date_start = getToday9am(),
      date_end = getTomorrow9am(),
    } = nextProps;

    const {
      isOkrug,
      company_id,
    } = nextProps.userData;

    const error = validDateRange(date_start, date_end, {isOkrug, company_id});

    return {
      error,
    };
  }
  handleSubmit = () => {
    const {
      date_start,
      date_end,
      car,
    } = this.getState();

    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      car,
    });
  };
  render() {
    const { readOnly } = this.props;

    const {
      date_start,
      date_end,
      car,
    } = this.getState();

    const CARS_OBJECTS = [
      { value: 'all', label: 'Все ТС' },
      { value: 'with_level_sensor', label: 'ТС с ДУТ' },
    ];

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={3}>
          <ExtField
            type="select"
            label="ТС"
            options={CARS_OBJECTS}
            value={car}
            boundKeys="car"
            onChange={this.props.handleChange}
            clearable={false}
            disabled={readOnly}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={9}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <FieldLabel>
                Период формирования
              </FieldLabel>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={6}>
          <DatePickerRange
            date_start_id="date_start"
            date_start_value={date_start}
            date_end_id="date_end"
            date_end_value={date_end}
            date_start_error={this.state.error.date_start_error}
            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Button
            block
            disabled={this.props.readOnly || !!this.state.error.date_start_error}
            onClick={this.handleSubmit}
          >
            Сформировать отчёт
          </EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}
export default compose<any, any>(
  ReportHeaderWrapper,
  connect<StateProps, {}, IPropsReportHeader, ReduxState>(
    (state: ReduxState) => ({
      userData: getSessionState(state).userData,
    }),
  ),
)(ReportHeader);

