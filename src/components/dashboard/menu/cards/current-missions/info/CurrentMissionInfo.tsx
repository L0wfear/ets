import * as React from 'react';

import { connect } from 'react-redux';
import { get } from 'lodash';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import {
  ButtenUpdateMission,
  LinkToOpenMissionInfoForm,
} from 'components/missions/mission/buttons/buttons';

import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  loadMissionById,
  updateMissionByPayload,
} from 'redux-main/trash-actions/mission';

import MissionRejectForm from 'components/missions/mission/MissionRejectForm';
import MissionInfoFormWrap from 'components/missions/mission/MissionInfoForm/MissionInfoFormWrap';
import { listData } from 'components/dashboard/menu/cards/current-missions/info/listData';

import {
  PropsCurrentMissionInfo,
  StateCurrentMissionInfo,
} from 'components/dashboard/menu/cards/current-missions/info/@types/CurrentMissionInfo.h';
import { RightButtonBlockContainer } from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import {
  DivNone,
} from 'global-styled/global-styled';

class CurrentMissionInfo extends React.Component<PropsCurrentMissionInfo, StateCurrentMissionInfo> {
  state = {
    showMissionInfoForm: false,
    showMissionRejectForm: false,
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

  completeMission = () => {
    this.props.getMissionById(this.props.infoData.mission_data.id)
      .then((res) => {
        const { mission } = res.payload;
        if (mission) {
          mission.status = 'complete';
          return this.props.updateMission(mission);
        }

        return Promise.resolve();
      })
      .catch((error) => {
        // tslint:disable-next-line
        console.log(error);
      })
      .then(() => {
        this.props.handleClose();
        this.refreshCard();
      });
  }

  rejectMission = () => {
    this.setState({ showMissionRejectForm: true });
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
              }}
              fromDashboard
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

const mapStateToProps = (state) => ({
  infoData: state.dashboard.current_missions.infoData,
});

const mapDispatchToProps = (dispatch) => ({
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
  getMissionById: (id) => (
    dispatch(
      loadMissionById(
        'none',
        id,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
    )
  ),
  updateMission: (payload) => (
    dispatch(
      updateMissionByPayload(
        'none',
        payload,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
    )
  ),
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'current_missions', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CurrentMissionInfo);
