import * as React from 'react';

import { connect } from 'react-redux';
import { get } from 'lodash';
import { compose } from 'recompose';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import {
  ButtenUpdateMission,
  LinkToOpenMissionInfoForm,
} from 'components/new/pages/missions/mission/buttons/buttons';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
  dashboardLoadDependentDataByCloseMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import MissionRejectForm from 'components/missions/mission/MissionRejectForm';
import MissionInfoFormWrap from 'components/new/ui/mission_info_form/MissionInfoFormWrap';
import { listData } from 'components/new/pages/dashboard/menu/cards/current-missions/info/listData';

import {
  PropsCurrentMissionInfo,
  StateCurrentMissionInfo,
  CurrentMissionInfoDispatchProps,
} from 'components/new/pages/dashboard/menu/cards/current-missions/info/@types/CurrentMissionInfo.h';
import { RightButtonBlockContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import {
  DivNone,
} from 'global-styled/global-styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

import { getWarningNotification } from 'utils/notifications';

import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

class CurrentMissionInfo extends React.Component<PropsCurrentMissionInfo, StateCurrentMissionInfo> {
  state = {
    showMissionInfoForm: false,
    showMissionRejectForm: false,
    action_at: null,
  };

  refreshCard = () => (
    this.props.loadData()
  )
  openMissiomInfoForm = () => {
    this.setState({ showMissionInfoForm: true });
  }
  handleFormHide = () => {
    this.setState({ showMissionInfoForm: false });
  }

  handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.handleClose();
  }

  completeMission = async () => {

    let action_at = null;

    const { time } = await loadMoscowTime();
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
  }

  rejectMission = () => {
    loadMoscowTime()
      .then(({ time }) => {
        const action_at = time.date;

        this.setState({
          showMissionRejectForm: true,
          action_at,
        });
      })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Произошла непредвиденная ошибка!'));
        }
      });
  }

  onReject = (refresh) => {
    this.setState({ showMissionRejectForm: false });
    if (refresh) {
      this.props.handleClose();
      this.refreshCard();
    }
  }

  render() {
    const { infoData } = this.props;

    return (
      <InfoCard title="Карточка задания" handleClose={this.handleClose}>
        <ul>
          {
            listData.map(({ RenderComponent, ...line}, index) => (
              RenderComponent ?
              (
                <RenderComponent key={line.path.join('/')} {...this.props} />
              )
              :
              (
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
          <ButtenUpdateMission onClick={this.completeMission} >Выполнено</ButtenUpdateMission>
          <ButtenUpdateMission onClick={this.rejectMission} >Не выполнено</ButtenUpdateMission>
        </RightButtonBlockContainer>
        {
          this.state.showMissionRejectForm ?
          (
            <MissionRejectForm
              show
              onReject={this.onReject}
              mission={{
                ...infoData.mission_data,
                car_gov_number: infoData.car_data.gov_number,
                waybill_number: infoData.waybill_data.number,
              }}
              fromDashboard
              action_at={this.state.action_at}
            />
          )
          :
          (
            <DivNone />
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
