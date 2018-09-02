import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import WaybillFormWrap from 'components/waybill/WaybillFormWrap';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import DutyMissionFormWrap from 'components/missions/duty_mission/DutyMissionFormWrap';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardLoadDependentDataByNewMission,
  dashboardLoadDependentDataByNewDutyMission,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';

import { LinkToOrder } from 'components/directories/order/buttons/buttons';
import { ButtonCreateMission } from 'components/missions/mission/buttons/buttons';
import { ButtonCreateDutyMission } from 'components/missions/duty_mission/buttons/buttons';
import { ButtonCreateWaybill } from 'components/waybill/buttons/buttons';

require('components/dashboard/new/menu/buttons/DashboardMenuButtons.scss');

class DashboardMenuButtons extends React.Component<any, any> {
  state = {
    showWaybillFormWrap: false,
    showMissionFormWrap: false,
    showDutyMissionFormWrap: false,
  };

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
        <div className="card_container">
          <div className="card_title">Управление</div>
          <div className="card_body">
            <ButtonCreateWaybill onClick={this.showWaybillFormWrap} >Создать путевой лист</ButtonCreateWaybill>
            <LinkToOrder to="/order"><Button active >Исполнение централизованного задания</Button></LinkToOrder>
            <ButtonCreateMission onClick={this.showMissionFormWrap} >Создать децентрализованное задание</ButtonCreateMission>
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
