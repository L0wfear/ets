import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Panel, Button } from 'react-bootstrap';
import BaseDiv from 'components/ui/Div.jsx';

import permissions from 'components/dashboard/config-data/permissions';
import permissions_waybill from 'components/waybill/config-data/permissions';
import permissions_order from 'components/directories/order/config-data/permissions';
import permissions_mission from 'components/missions/mission/config-data/permissions';
import permissions_duty_mission from 'components/missions/duty_mission/config-data/permissions';

import enhanceWithPermissions from 'components/util/RequirePermissionsNew';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap.jsx';
import DutyMissionFormWrap from 'components/missions/duty_mission/DutyMissionFormWrap.jsx';
import WaybillFormWrap from 'components/waybill/WaybillFormWrap.jsx';

const Div = enhanceWithPermissions({})(BaseDiv);

@autobind
export default class MasterManagementCard extends React.Component {

  static get propTypes() {
    return {
      hidden: PropTypes.bool,
      refreshCard: PropTypes.func.isRequired,
      goToOrders: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      showWaybillForm: false,
      showMissionForm: false,
      showDutyMissionForm: false,
    };
  }

  onWaybillFormHide = () => {
    this.props.refreshCard('waybill_draft');
    this.props.refreshCard('waybill_in_progress');
    this.props.refreshCard('waybill_completed');
    this.setState({ showWaybillForm: false });
  }

  onMissionFormHide() {
    this.props.refreshCard(null, null, 'waybill_draft');
    this.setState({ showMissionForm: false });
  }

  onDutyMissionFormHide() {
    this.props.refreshCard(null, null, 'current_duty_missions');
    this.setState({ showDutyMissionForm: false });
  }

  showWaybillForm = () => this.setState({ showWaybillForm: true });
  showMissionForm = () => this.setState({ showMissionForm: true });
  showDutyMissionForm = () => this.setState({ showDutyMissionForm: true });

  render() {
    return (
      <Div permission={permissions.manage} className="dashboard-card-sm dashboard-management-card" hidden={this.props.hidden}>
        <Panel header={'Управление'} bsStyle="success">
          <Div permissions={permissions_waybill.create} className="dashboard-btn-wrapper">
            <Button bsSize="small" onClick={this.showWaybillForm}>
              Создать путевой лист
            </Button>
          </Div>
          <Div permissions={permissions_order.list} className="dashboard-btn-wrapper container-button-create-cz">
            <Button bsSize="small" onClick={this.props.goToOrders}>
              Исполнение централизованного задания
            </Button>
          </Div>
          <Div permissions={permissions_mission.create} className="dashboard-btn-wrapper">
            <Button bsSize="small" onClick={this.showMissionForm}>
              Создать децентрализованное задание
            </Button>
          </Div>
          <Div permissions={permissions_duty_mission.create} className="dashboard-btn-wrapper">
            <Button bsSize="small" onClick={this.showDutyMissionForm}>
              Создать наряд-задание
            </Button>
          </Div>
        </Panel>
        <WaybillFormWrap
          onFormHide={this.onWaybillFormHide}
          onCallback={this.onWaybillFormHide}
          showForm={this.state.showWaybillForm}
          element={null}
          entity={'waybill'}
          fromDashboard
        />
        <MissionFormWrap
          onFormHide={this.onMissionFormHide}
          showForm={this.state.showMissionForm}
          fromDashboard
          element={null}
        />
        <DutyMissionFormWrap
          onFormHide={this.onDutyMissionFormHide}
          showForm={this.state.showDutyMissionForm}
          element={null}
          fromDashboard
        />
      </Div>
    );
  }

}
