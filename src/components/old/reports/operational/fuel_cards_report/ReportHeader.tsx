import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { createValidDateTime, diffDates } from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { actionLoadAppConfig } from 'redux-main/reducers/modules/session/action_get_config';
import { compose } from 'recompose';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { SWITCH_REPORT_TYPE_OPTIONS } from 'constants/dictionary';

type IPropsReportHeader = {
  date_start: string;
  date_end: string;
  switch_report_type: string;
  actionLoadAppConfig: HandleThunkActionCreator<typeof actionLoadAppConfig>;
  appConfig: InitialStateSession['appConfig'];
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper;

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  componentDidMount() {
    this.props.actionLoadAppConfig();
  }
  componentDidUpdate(prevProps: IPropsReportHeader) {
    const {
      shift: {
        shift_start,
        shift_end,
      },
    } = this.props.appConfig;

    const triggerOnUpdate = (
      diffDates(shift_start, prevProps.appConfig.shift.shift_start)
      || diffDates(shift_end, prevProps.appConfig.shift.shift_end)
    );

    if (triggerOnUpdate) {
      this.props.handleChange('date_start', createValidDateTime(shift_start));
      this.props.handleChange('date_end', createValidDateTime(shift_end));
    }
  }
  handleSubmit = () => {
    const {
      date_start = this.props.appConfig.shift.shift_start,
      date_end = this.props.appConfig.shift.shift_end,
    } = this.props;

    const {
      switch_report_type
    } = this.getState();

    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      switch_report_type,
    });
  };

  getState() {
    const {
      switch_report_type = 'fuel_cards'
    } = this.props;

    return {
      switch_report_type
    };
  }

  render() {
    const {
      date_start = this.props.appConfig.shift.shift_start,
      date_end = this.props.appConfig.shift.shift_end,
      readOnly,
    } = this.props;

    const {
      switch_report_type
    } = this.getState();

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={3}>
          <ExtField
            type="select"
            options={SWITCH_REPORT_TYPE_OPTIONS}
            value={switch_report_type}
            onChange={this.props.handleChange}
            boundKeys={'switch_report_type'}
            clearable={false}
            label={'Группировка'}
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

export default compose<any, any>(
  connect<any, { actionLoadAppConfig: HandleThunkActionCreator<typeof actionLoadAppConfig>; }, any, ReduxState>(
    (state) => ({
      appConfig: getSessionState(state).appConfig,
    }),
    (dispatch: any) => ({
      actionLoadAppConfig: (...arg) => (
        dispatch(
          actionLoadAppConfig(...arg),
        )
      ),
    }),
  ),
  ReportHeaderWrapper,
)(ReportHeader);
