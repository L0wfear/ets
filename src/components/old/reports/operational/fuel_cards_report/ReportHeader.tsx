import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import Div from 'components/old/ui/Div';
import { createValidDateTime, diffDates } from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { actionLoadAppConfig } from 'redux-main/reducers/modules/session/action_get_config';
import { compose } from 'recompose';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
  actionLoadAppConfig: HandleThunkActionCreator<typeof actionLoadAppConfig>;
  appConfig: InitialStateSession['appConfig'];
}

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

    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
    });
  }
  render() {
    const {
      date_start = this.props.appConfig.shift.shift_start,
      date_end = this.props.appConfig.shift.shift_end,
      readOnly,
    } = this.props;

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col mdOffset={3} md={6}>
              <Div><label htmlFor=" ">Период формирования</label></Div>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col mdOffset={3} md={6}>
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
  connect<any, { actionLoadAppConfig: HandleThunkActionCreator<typeof actionLoadAppConfig>}, any, ReduxState>(
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
