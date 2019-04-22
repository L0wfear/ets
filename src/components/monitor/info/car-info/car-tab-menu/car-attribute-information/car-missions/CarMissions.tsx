import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';

import MissionsList from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/car-missions/missions-list/MissionsList';
import MissionInfoFormWrap from 'components/new/ui/mission_info_form/MissionInfoFormWrap';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';

import {
  loadMissionDataById,
} from 'redux-main/trash-actions/mission';
import { fetchCarInfo } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { ReduxState } from 'redux-main/@types/state';

type CarMissionsDispatchProps = {
  actionGetMissionById: HandleThunkActionCreator<typeof missionsActions.actionGetMissionById>;
} & Record<any, any>;

type PropsCarMissions = {
  asuods_id: number;
  gps_code: string;
  fetchMissionsData: any;
  loadMissionDataById: any;
} & CarMissionsDispatchProps;

type StateCarMissions = {
  selectedMissionIdToShowMain: number | void;
  selectedMissionIdToShowInfo;
  missionToShow: any;
  missionToShowInfo: any;
};

class CarMissions extends React.Component<PropsCarMissions, StateCarMissions> {
  state = {
    selectedMissionIdToShowInfo: null,
    selectedMissionIdToShowMain: null,
    missionToShow: null,
    missionToShowInfo: null,
  };

  showMissionInfoForm = (id) => {
    this.setState({
      selectedMissionIdToShowInfo: id,
      selectedMissionIdToShowMain: null,
    });
    this.props.loadMissionDataById(id).then(({ payload: { mission_data } }) => {
      if (id === this.state.selectedMissionIdToShowInfo) {
        if (mission_data) {
          this.setState({
            missionToShowInfo: mission_data,
          });
        } else {
          console.log('not_find_mission_data'); // tslint:disable-line:no-console
          this.setState({ selectedMissionIdToShowInfo: null });
        }
      }
    });
  };
  showMissionForm = async (id) => {
    this.setState({
      selectedMissionIdToShowMain: id,
      selectedMissionIdToShowInfo: null,
    });
    let mission = null;
    try {
      mission = await this.props.actionGetMissionById(
        id,
        {
          page: 'dashboard',
        },
      );
    } catch (error) {
      console.error(error); // tslint:disable-line
    }
    if (id === this.state.selectedMissionIdToShowMain) {
      if (mission) {
        this.setState({
          missionToShow: mission,
        });
      } else {
        console.log('not_find_mission'); // tslint:disable-line:no-console
        this.setState({ selectedMissionIdToShowMain: null });
      }
    }
  };
  hideMain = (isSubmitted) => {
    if (isSubmitted) {
      this.props.fetchMissionsData({
        gps_code: this.props.gps_code,
        asuods_id: this.props.asuods_id,
      });
    }
    this.setState({
      selectedMissionIdToShowMain: null,
      missionToShow: null,
    });
  }

  hideInfo = () =>
    this.setState({
      selectedMissionIdToShowInfo: null,
      missionToShowInfo: null,
    });
  render() {
    const { missionToShow, missionToShowInfo } = this.state;

    return (
      <div className="car_info_block column tab-data">
        <div className="car_info-track_date_title">
          <div>Задания</div>
        </div>
        <MissionsList
          showMissionInfoForm={this.showMissionInfoForm}
          showMissionForm={this.showMissionForm}
        />
        <MissionFormLazy
          onFormHide={this.hideMain}
          showForm={!!missionToShow && !!this.state.selectedMissionIdToShowMain}
          element={missionToShow}
        />
        <MissionInfoFormWrap
          onFormHide={this.hideInfo}
          showForm={
            !!missionToShowInfo && !!this.state.selectedMissionIdToShowInfo
          }
          element={missionToShowInfo}
          fromMonitor
        />
      </div>
    );
  }
}

export default connect<any, CarMissionsDispatchProps, any, ReduxState>(
  (state) => ({
    gps_code: state.monitorPage.carInfo.gps_code,
    asuods_id: (
      state.monitorPage.carActualGpsNumberIndex[
        state.monitorPage.carInfo.gps_code
      ] || { asuods_id: null }
    ).asuods_id,
  }),
  (dispatch: any) => ({
    actionGetMissionById: (...arg) => (
      dispatch(
        missionsActions.actionGetMissionById(...arg),
      )
    ),
    loadMissionDataById: (id) => dispatch(loadMissionDataById('NONE', id)),
    fetchMissionsData: (props) => {
      return dispatch(
        fetchCarInfo({
          asuods_id: props.asuods_id,
          gps_code: props.gps_code,
        }),
      );
    },
  }),
)(CarMissions);
