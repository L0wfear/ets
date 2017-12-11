import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';

import BaseDiv from 'components/ui/Div.jsx';
import { Panel, Button } from 'react-bootstrap';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import MissionFormWrap from '../missions/mission/MissionFormWrap.jsx';
import DutyMissionFormWrap from '../missions/duty_mission/DutyMissionFormWrap.jsx';
import WaybillFormWrap from '../waybill/WaybillFormWrap.jsx';

const Div = enhanceWithPermissions(BaseDiv);

@autobind
export default class MasterManagementCard extends React.Component {

  static get propTypes() {
    return {
      hidden: PropTypes.bool,
      refreshCard: PropTypes.func.isRequired,
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

  onWaybillFormHide() {
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

  render() {
    return (
      <Div permissions={['dashboard.manage']} className="dashboard-card-sm dashboard-management-card" hidden={this.props.hidden}>
        <Panel header={'Управление'} bsStyle="success">
          <Div permissions={['waybill.create']} className="dashboard-btn-wrapper">
            <Button bsSize="small" onClick={() => this.setState({ showWaybillForm: true })}>
              Создать путевой лист
            </Button>
          </Div>
          <Div permissions={['mission.create']} className="dashboard-btn-wrapper">
            <Button bsSize="small" onClick={() => this.setState({ showMissionForm: true })}>
              Создать задание
            </Button>
          </Div>
          <Div permissions={['duty_mission.create']} className="dashboard-btn-wrapper">
            <Button bsSize="small" onClick={() => this.setState({ showDutyMissionForm: true })}>
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
        />
      </Div>
    );
  }

}
