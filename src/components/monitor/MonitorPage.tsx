import * as React from 'react';

import { compose } from 'recompose';
import triggerOnChangeCompany from 'components/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
import { connect, HandleThunkActionCreator } from 'react-redux';

import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import MapWrap from 'components/monitor/MapWrap';
import ToolBar from 'components/monitor/tool-bar/ToolBar';

import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { getCompany } from 'redux-main/trash-actions/uniq';
import { resetMonitorPageState, actionMonitorPageLoadCarActual } from 'components/monitor/redux-main/models/actions-monitor-page';
import {
  MONITOR_PAGE_SET_GEOMETRY,
  MONITOR_PAGE_SET_COMPANY,
} from 'components/monitor/redux-main/models/monitor-page';
import { MonitorPageContainer } from 'components/monitor/styled';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';

type StateProps = {
  token: InitialStateSession['token'];
};

type DispatchProps = {
  actionMonitorPageLoadCarActual: HandleThunkActionCreator<typeof actionMonitorPageLoadCarActual>;
  loadGeozonesOdhMkad: HandleThunkActionCreator<typeof loadGeozones>;
  getCompany: HandleThunkActionCreator<typeof getCompany>;
  resetMonitorPageState: HandleThunkActionCreator<typeof resetMonitorPageState>;
};

type OwnProps = {};

type PropsMonitorPage = (
  StateProps
  & DispatchProps
  & OwnProps
);

const MonitorPage: React.FC<PropsMonitorPage> = React.memo(
  (props) => {
    React.useEffect(
      () => {
        props.actionMonitorPageLoadCarActual();
        props.loadGeozonesOdhMkad();
        props.getCompany();

        return () => props.resetMonitorPageState();
      },
      [],
    );
    React.useLayoutEffect(
      () => {
        const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
        if (document) {
          document.title = `${etsName} Карта`;
        }

        return () => {
          if (document) {
            document.title = etsName;
          }
        };
      },
    );

    return (
      props.token ?
        <MonitorPageContainer>
          <MapWrap />
          <ToolBar />
        </MonitorPageContainer>
      :
        <div>загрузка...</div>
    );
  },
);

export default compose<PropsMonitorPage, OwnProps>(
  triggerOnChangeCompany,
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    (state) => ({
      token: getSessionState(state).token,
    }),
    (dispatch: any) => ({
      actionMonitorPageLoadCarActual: (...arg) => (
        dispatch(
          actionMonitorPageLoadCarActual(...arg),
        )
      ),
      loadGeozonesOdhMkad: () => (
        dispatch(
          loadGeozones(MONITOR_PAGE_SET_GEOMETRY, GEOOBJECTS_OBJ.odh_mkad.serverName),
        )
      ),
      getCompany: () => (
        dispatch(
          getCompany(MONITOR_PAGE_SET_COMPANY),
        )
      ),
      resetMonitorPageState: () => (
        dispatch(
          resetMonitorPageState(),
        )
      ),
    }),
  ),
)(MonitorPage);
