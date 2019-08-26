import * as React from 'react';
import { keyBy } from 'lodash';

import { compose } from 'recompose';
import triggerOnChangeCompany from 'components/old/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
import { connect, HandleThunkActionCreator, useDispatch } from 'react-redux';

import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import MapWrap from 'components/old/monitor/MapWrap';
import ToolBar from 'components/old/monitor/tool-bar/ToolBar';

import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { getCompany } from 'redux-main/trash-actions/uniq';
import { resetMonitorPageState, actionMonitorPageLoadCarActual, monitorPageSetcarActualGpsNumberIndex } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import {
  MONITOR_PAGE_SET_GEOMETRY,
  MONITOR_PAGE_SET_COMPANY,
} from 'components/old/monitor/redux-main/models/monitor-page';
import { MonitorPageContainer } from 'components/old/monitor/styled';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { MonitorSearchParams } from 'components/old/monitor/monitor_search_params';

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
    const dispatch = useDispatch();

    React.useEffect(
      () => {
        let i_exist = true;

        props.actionMonitorPageLoadCarActual().then(
          (result) => {
            if (i_exist) {
              dispatch(
                monitorPageSetcarActualGpsNumberIndex(
                  keyBy(
                    result.data,
                    'gps_code',
                  ),
                ),
              );
            }
          },
        );

        props.loadGeozonesOdhMkad();
        props.getCompany();

        return () => {
          i_exist = false;
          props.resetMonitorPageState();
        };
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
          <MonitorSearchParams />
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
