import * as React from 'react';

import { connect, HandleThunkActionCreator } from 'react-redux';
import { get } from 'lodash';
import { compose } from 'recompose';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';

import {
  LinkToOpenMissionInfoForm,
} from 'components/new/pages/missions/mission/buttons/buttons';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
  dashboardLoadDependentDataByCloseMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import MissionInfoFormWrap from 'components/new/ui/mission_info_form/MissionInfoFormWrap';
import { listData } from 'components/new/pages/dashboard/menu/cards/current-missions/info/listData';

import { RightButtonBlockContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

import { getWarningNotification } from 'utils/notifications';

import missionsActions from 'redux-main/reducers/modules/missions/actions';
import MissionRejectForm from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/mission/form/MissionRejectForm';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import {
  CurrentMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type CurrentMissionInfoDispatchProps = {
  dispatch: EtsDispatch;
  actionGetMissionById: HandleThunkActionCreator<typeof missionsActions.actionGetMissionById>;
  actionUpdateMission: HandleThunkActionCreator<typeof missionsActions.actionUpdateMission>;
} & Record<any, any>;

type PropsCurrentMissionInfo = {
  infoData: CurrentMissionsInfoDataType;
  loadDataAfterCloseMission: () => Promise<any>;

  handleClose: any;
  loadData: any;
} & CurrentMissionInfoDispatchProps;

type StateCurrentMissionInfo = {
  showMissionInfoForm: boolean;
  missionRejectForm: Mission;
  action_at: string | Date;
};

class CurrentMissionInfo extends React.Component<PropsCurrentMissionInfo, StateCurrentMissionInfo> {
  state = {
    showMissionInfoForm: false,
    missionRejectForm: null,
    action_at: null,
  };

  refreshCard = () => (
    this.props.loadData()
  );
  openMissiomInfoForm = () => {
    this.setState({ showMissionInfoForm: true });
  };
  handleFormHide = () => {
    this.setState({ showMissionInfoForm: false });
  };

  handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.handleClose();
  };

  completeMission = async () => {

    let action_at = null;

    const time = await this.props.dispatch(
      actionLoadTimeMoscow(
        {},
        {
          page: 'dashboard',
        },
      ));
    action_at = time.date;

    let mission = null;
    try {
      mission = await this.props.actionGetMissionById(
        this.props.infoData.mission_data.id,
        {
          page: 'dashboard',
        },
      );
    } catch (error) {
      console.error(error); // tslint:disable-line
    }
    if (mission) {
      await this.props.actionUpdateMission(
        {
          ...mission, status:
          'complete', action_at,
        },
        {
          page: 'dashboard',
        },
      );
    }

    this.props.handleClose();
    this.refreshCard();
    this.props.loadDataAfterCloseMission();
  };

  rejectMission = () => {
    this.props.dispatch(
      actionLoadTimeMoscow(
        {},
        {
          page: 'dashboard',
        },
      )).then(async (time) => {
      const action_at = time.date;

      let mission = null;
      try {
        mission = await this.props.actionGetMissionById(
          this.props.infoData.mission_data.id,
          {
            page: 'dashboard',
          },
        );
      } catch (error) {
        console.error(error); // tslint:disable-line
      }
      if (mission) {
        this.setState({
          missionRejectForm: mission,
          action_at,
        });
      }
    })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Произошла непредвиденная ошибка!'));
        }
      });
  };

  onReject = (refresh) => {
    this.setState({ missionRejectForm: null });
    if (refresh) {
      this.props.handleClose();
      this.refreshCard();
    }
  };

  render() {
    const { infoData } = this.props;

    return (
      <InfoCard title="Карточка задания" handleClose={this.handleClose}>
        <ul>
          {
            listData.map(({ RenderComponent, ...line}, index) => (
              RenderComponent
                ? (
                  <RenderComponent key={line.path.join('/')} {...this.props} />
                )
                :              (
                  <li key={line.path.join('/')}>
                    <b>{`${line.title}: `}</b>
                    <span>{get(infoData, line.path, '---') || '---'}</span>
                  </li>
                )
            ))
          }
        </ul>
        <LinkToOpenMissionInfoForm openMissiomInfoForm={this.openMissiomInfoForm}/>
        <RightButtonBlockContainer>
          <EtsBootstrap.Button onClick={this.completeMission} permissions={missionPermissions.update}>Выполнено</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={this.rejectMission} permissions={missionPermissions.update}>Не выполнено</EtsBootstrap.Button>
        </RightButtonBlockContainer>
        {
          Boolean(this.state.missionRejectForm) && (
            <MissionRejectForm
              show
              onReject={this.onReject}
              mission={this.state.missionRejectForm}
              action_at={this.state.action_at}
            />
          )
        }
        <MissionInfoFormWrap
          onFormHide={this.handleFormHide}
          showForm={this.state.showMissionInfoForm}
          element={this.props.infoData}
        />
      </InfoCard>
    );
  }
}

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'current_missions', 'infoData'],
    type: 'none',
  }),
  connect<any, CurrentMissionInfoDispatchProps, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).current_missions.infoData,
    }),
    (dispatch: any) => ({
      dispatch,
      handleClose: () => (
        dispatch(
          dashboardLoadMissionDataForCurrentMission(null),
        )
      ),
      loadData: () => (
        dispatch(
          dashboardLoadCurrentMissions(),
        )
      ),
      loadDataAfterCloseMission: () => (
        dispatch(
          dashboardLoadDependentDataByCloseMission(),
        )
      ),
      actionUpdateMission: (...arg) => (
        dispatch(
          missionsActions.actionUpdateMission(...arg),
        )
      ),
      actionGetMissionById: (...arg) => (
        dispatch(
          missionsActions.actionGetMissionById(...arg),
        )
      ),
    }),
  ),
)(CurrentMissionInfo);
