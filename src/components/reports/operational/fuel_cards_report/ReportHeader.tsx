import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import Div from 'components/ui/Div';
import { createValidDateTime, diffDates } from 'utils/dates';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { sessionSetAppConfig } from 'redux-main/reducers/modules/session/action_get_config';
import { compose } from 'recompose';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
  sessionSetAppConfig: HandleThunkActionCreator<typeof sessionSetAppConfig>;
  appConfig: InitialStateSession['appConfig'];
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  componentDidMount() {
    this.props.sessionSetAppConfig();
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
      <Row className="report-page__header">
        <Col md={12}>
          <Row>
            <Col mdOffset={3} md={6}>
              <Div><label htmlFor=" ">Период формирования</label></Div>
            </Col>
          </Row>
        </Col>
        <Col mdOffset={3} md={6}>
          <DatePickerRange
            date_start_id="date_start"
            date_start_value={date_start}
            date_end_id="date_end"
            date_end_value={date_end}

            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </Col>
        <Col md={3}>
          <Button
            block
            disabled={this.props.readOnly}
            onClick={this.handleSubmit}
          >
            Сформировать отчёт
          </Button>
        </Col>
      </Row>
    );
  }
}

export default compose<any, any>(
  connect<any, { sessionSetAppConfig: HandleThunkActionCreator<typeof sessionSetAppConfig>}, any, ReduxState>(
    (state) => ({
      appConfig: getSessionState(state).appConfig,
    }),
    (dispatch: any) => ({
      sessionSetAppConfig: (...arg) => (
        dispatch(
          sessionSetAppConfig(...arg),
        )
      ),
    }),
  ),
  ReportHeaderWrapper,
)(ReportHeader);
