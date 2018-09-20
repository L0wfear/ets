import * as React from 'react';
import { connect } from 'react-redux';

import MissionsList from 'components/monitor/new/info/car-info/car-tab-menu/car-attribute-information/car-missions/missions-list/MissionsList';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoForm/MissionInfoFormWrap.jsx';

import {
  loadMissionById,
  loadMissionDataById,
} from 'redux/trash-actions/mission';

type PropsCarMissions = {
  loadMissionById: Function;
  loadMissionDataById: Function;
};

type StateCarMissions = {
  selectedMissionIdToShowMain: number | void;
  selectedMissionIdToShowInfo
  missionToShow: any;
  missionToShowInfo: any;
};

class CarMissions extends React.Component<PropsCarMissions, StateCarMissions> {
  state = {
    selectedMissionIdToShowInfo: null,
    selectedMissionIdToShowMain: null,
    missionToShow: null,
    missionToShowInfo: null,
  }
  showMissionInfoForm = (id) => {
    this.setState({ selectedMissionIdToShowInfo: id, selectedMissionIdToShowMain: null })
    this.props.loadMissionDataById(id).then(({ payload: { mission_data } }) => {
      if (id === this.state.selectedMissionIdToShowInfo) {
        if (mission_data) {
          this.setState({
            missionToShowInfo: mission_data,
          });
        } else {
          // tslint:disable-next-line
          console.log('not_find_mission_data');
          this.setState({ selectedMissionIdToShowInfo: null });
        }
      }
    });
  }
  showMissionForm = (id) => {
    this.setState({ selectedMissionIdToShowMain: id, selectedMissionIdToShowInfo: null })
    this.props.loadMissionById(id).then(({ payload: { mission } }) => {
      if (id === this.state.selectedMissionIdToShowMain) {
        if (mission) {
          this.setState({
            missionToShow: mission,
          });
        } else {
          // tslint:disable-next-line
          console.log('not_find_mission');
          this.setState({ selectedMissionIdToShowMain: null });
        }
      }
    });
  }
  hideMain = () => (
    this.setState({
      selectedMissionIdToShowMain: null,
      missionToShow: null,
    })
  )
  hideInfo = () => (
    this.setState({
      selectedMissionIdToShowInfo: null,
      missionToShowInfo: null,
    })
  )
  render() {
    const { 
      missionToShow,
      missionToShowInfo,
    } = this.state;

    return (
      <div className="car_info_block column tab-data">
        <div className="car_info-track_date_title">
          <div>Задания</div>
        </div>
        <MissionsList
          showMissionInfoForm={this.showMissionInfoForm}
          showMissionForm={this.showMissionForm}
        />
        <MissionFormWrap
          onFormHide={this.hideMain}
          showForm={!!missionToShow && !!this.state.selectedMissionIdToShowMain}
          element={missionToShow}
        />
        <MissionInfoFormWrap
          onFormHide={this.hideInfo}
          showForm={!!missionToShowInfo && !!this.state.selectedMissionIdToShowInfo}
          element={missionToShowInfo}
          fromMonitor
        />
      </div>
    )
  }
}

const mapStateToProps = null;
const mapDispatchToProps = dispatch => ({
  loadMissionById: (id) => dispatch(loadMissionById('NONE', id)),
  loadMissionDataById: (id) => dispatch(loadMissionDataById('NONE', id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarMissions);
