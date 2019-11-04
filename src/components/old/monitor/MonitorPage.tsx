import * as React from 'react';
import { keyBy } from 'lodash';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';

import triggerOnChangeCompany from 'components/old/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';

import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import MapWrap from 'components/old/monitor/MapWrap';
import ToolBar from 'components/old/monitor/tool-bar/ToolBar';

import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { resetMonitorPageState, actionMonitorPageLoadCarActual, monitorPageSetcarActualGpsNumberIndex, actionSetCompanyIndex } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import {
  MONITOR_PAGE_SET_GEOMETRY,
} from 'components/old/monitor/redux-main/models/monitor-page';
import { MonitorPageContainer } from 'components/old/monitor/styled';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { MonitorSearchParams } from 'components/old/monitor/monitor_search_params';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadCompany } from 'redux-main/reducers/modules/company/actions';

type StateProps = {
  token: InitialStateSession['token'];
};

type DispatchProps = {
  actionMonitorPageLoadCarActual: HandleThunkActionCreator<typeof actionMonitorPageLoadCarActual>;
  loadGeozonesOdhMkad: HandleThunkActionCreator<typeof loadGeozones>;
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
    const dispatch = etsUseDispatch();

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

        dispatch(
          actionLoadCompany({}, { page: 'mainpage' }),
        ).then(
          ({ dataIndex }) => {
            if (i_exist) {
              dispatch(
                actionSetCompanyIndex(dataIndex),
              );
            }
          },
        );

        return () => {
          i_exist = false;
          props.resetMonitorPageState();
        };
      },
      [],
    );
    React.useLayoutEffect(
      () => {
        const meta = document.querySelector('meta[property="og:title"]');
        const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
        const new_title = `${etsName} Карта`;

        if (document) {
          document.title = new_title;
        }
        if (meta) {
          meta.setAttribute('content', new_title);
        }

        return () => {
          const metaNew = document.querySelector('meta[property="og:title"]');
          if (document) {
            document.title = etsName;
          }
          if (metaNew) {
            metaNew.setAttribute('content', etsName);
          }
        };
      },
    );

    return (
      props.token
        ? <MonitorPageContainer>
          <MapWrap />
          <ToolBar />
          <MonitorSearchParams />
        </MonitorPageContainer>
        :        <div>загрузка...</div>
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
      resetMonitorPageState: () => (
        dispatch(
          resetMonitorPageState(),
        )
      ),
    }),
  ),
)(MonitorPage);
