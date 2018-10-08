import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import WaybillFormWrap from 'components/waybill/WaybillFormWrap';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import DutyMissionFormWrap from 'components/missions/duty_mission/DutyMissionFormWrap';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardLoadDependentDataByNewMission,
  dashboardLoadDependentDataByNewDutyMission,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';

require('components/dashboard/new/menu/buttons/DashboardMenuButtons.scss');

const ButtonCreateWaybill = withRequirePermissionsNew({
  permissions: 'waybill.create',
})(Button);

const ButtonCreateMission = withRequirePermissionsNew({
  permissions: 'mission.create',
})(Button);

const ButtonCreateDutyMission = withRequirePermissionsNew({
  permissions: 'duty_mission.create',
})(Button);

class DashboardMenuButtons extends React.Component<any, any> {
  state = {
    showWaybillFormWrap: false,
    showMissionFormWrap: false,
    showDutyMissionFormWrap: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      Object.entries(nextProps).some(([key, value]) => this.props[key] !== value)
      || Object.entries(nextState).some(([key, value]) => this.state[key] !== value)
    )
  }

  showWaybillFormWrap = () => {
    this.setState({ showWaybillFormWrap: true });
  }

  handleFormHideWaybillFormWrap = () => {
    this.props.loadDataAfterCreateWaybill();
    this.setState({ showWaybillFormWrap: false });
  }

  showMissionFormWrap = () => {
    this.setState({ showMissionFormWrap: true });
  }

  handleFormHideMissionFormWrap = () => {
    this.props.loadDataAfterCreateMission();
    this.setState({ showMissionFormWrap: false });
  }

  showDutyMissionFormWrap = () => {
    this.setState({ showDutyMissionFormWrap: true });
  }

  handleFormHideDutyMissionFormWrap = () => {
    this.props.loadDataAfterCreateDutyMission();
    this.setState({ showDutyMissionFormWrap: false });
  }

  render() {
    return (
      <div className="dashboard_menu_buttons">
        <div className="card_container control">
          <div className="card_title">Управление</div>
          <div className="card_body">
            <ButtonCreateWaybill onClick={this.showWaybillFormWrap} >Создать путевой лист</ButtonCreateWaybill>
            <ButtonCreateMission onClick={this.showMissionFormWrap} >Создать задание</ButtonCreateMission>
            <ButtonCreateDutyMission onClick={this.showDutyMissionFormWrap} >Создать наряд-задание</ButtonCreateDutyMission>
          </div>
        </div>
        <WaybillFormWrap
          onFormHide={this.handleFormHideWaybillFormWrap}
          onCallback={this.handleFormHideWaybillFormWrap}
          showForm={this.state.showWaybillFormWrap}
          element={null}
          entity={'waybill'}
          fromDashboard
        />
        <MissionFormWrap
          onFormHide={this.handleFormHideMissionFormWrap}
          showForm={this.state.showMissionFormWrap}
          fromDashboard
          element={null}
        />
        <DutyMissionFormWrap
          onFormHide={this.handleFormHideDutyMissionFormWrap}
          showForm={this.state.showDutyMissionFormWrap}
          element={null}
        />
      </div>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  loadDataAfterCreateWaybill: () => (
    dispatch(
      dashboardLoadDependentDataByWaybillDraft(),
    )
  ),
  loadDataAfterCreateMission: () => (
    dispatch(
      dashboardLoadDependentDataByNewMission(),
    )
  ),
  loadDataAfterCreateDutyMission: () => (
    dispatch(
      dashboardLoadDependentDataByNewDutyMission(),
    )
  ),
});

export default connect(
  null,
  mapDispatchToProps,
)(DashboardMenuButtons);
