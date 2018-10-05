import * as React from 'react';
import { Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import { get } from 'lodash';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

const ButtenChangeMission = withRequirePermissionsNew({
  permissions: 'mission.update',
})(Button);

import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/dashboard/redux/modules/dashboard/actions-dashboard';

import {
  loadMissionById,
  updateMissionByPayload,
} from 'redux/trash-actions/mission';

import MissionRejectForm from 'components/missions/mission/MissionRejectForm';
import MissionInfoFormWrap from 'components/missions/mission/MissionInfoForm/MissionInfoFormWrap';
import { listData } from 'components/dashboard/menu/cards/current-missions/info/listData';

import {
  PropsCurrentMissionInfo,
  StateCurrentMissionInfo,
} from 'components/dashboard/menu/cards/current-missions/info/@types/CurrentMissionInfo.h';
const MissionInfoFormWrapTSX: any = MissionInfoFormWrap;

const LinkToOpenMissionInfoForm: React.SFC<any> = withRequirePermissionsNew({
  permissions: 'mission.read',
})(props => (
  <div>
    <a className="pointer" onClick={props.openMissiomInfoForm} >Подробнее...</a>
  </div>
));

class CurrentMissionInfo extends React.Component<PropsCurrentMissionInfo, StateCurrentMissionInfo> {
  state = {
    showMissionInfoForm: false,
    showMissionRejectForm: false,
  }
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
      .then(({ mission }) => {
        if (mission) {
          mission.status = 'complete';

          return this.props.updateMission(mission);
        }

        return Promise.resolve();
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        this.props.handleClose();
        this.refreshCard();
      })
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
        <div className="right_button_block">
          <ButtenChangeMission onClick={this.completeMission} >Выполнено</ButtenChangeMission>
          <ButtenChangeMission onClick={this.rejectMission} >Не выполнено</ButtenChangeMission>
        </div>
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
            <div className="none"></div>
          )
        }
        <MissionInfoFormWrapTSX
          onFormHide={this.handleFormHide}
          showForm={this.state.showMissionInfoForm}
          element={this.props.infoData}
        />
      </InfoCard>
    )
  }
};

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
        '',
        id,
        {
          promise: true,
          page: 'dashboard',
        },
      )
    ).payload
  ),
  updateMission: (payload) => (
    dispatch(
      updateMissionByPayload(
        '',
        payload,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
    ).payload
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