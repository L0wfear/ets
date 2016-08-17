import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import MissionFormWrap from '../missions/mission/MissionFormWrap.jsx';
import DutyMissionFormWrap from '../missions/duty_mission/DutyMissionFormWrap.jsx';
import MonitorFormWrap from './MonitorFormWrap.jsx';
import WaybillFormWrap from '../waybill/WaybillFormWrap.jsx';
import ElementsList from 'components/ElementsList.jsx';

export default class MasterManagementCard extends ElementsList {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showWaybillForm: false,
      showMissionForm: false,
      showDutyMissionForm: false,
    })
  }

  componentDidMount() {
		const { flux } = this.context;
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('routes').getRoutes();
    flux.getActions('objects').getCars();
    flux.getActions('missions').getMissionSources();
  }

  showMonitorForm() {
    this.setState({showMonitorForm: true});
  }

  onWaybillFormHide() {
    this.props.refreshCard('waybill_draft');
    this.props.refreshCard('waybill_active');
    this.setState({showWaybillForm: false});
  }

  onMissionFormHide() {
    this.props.refreshCard(null, null, 'waybill_draft');
    this.setState({showMissionForm: false});
  }

  onDutyMissionFormHide() {
    this.setState({showDutyMissionForm: false});
  }

  render() {
    let canCreateMission = this.context.flux.getStore('session').getPermission("mission.create");
    let canCreateDutyMission = this.context.flux.getStore('session').getPermission("duty_mission.create");
    let canCreateWaybill = this.context.flux.getStore('session').getPermission("waybill.create");

    return (
      <Div className="dashboard-card-sm dashboard-management-card" hidden={this.props.hidden}>
        <Panel header={'Управление'} bsStyle="success">
          {canCreateWaybill ?
            <Div className="dashboard-btn-wrapper">
              <Button bsSize="small" onClick={() => this.setState({showWaybillForm: true})}>Создать путевой лист</Button>
            </Div> : ''}
          {canCreateMission ?
            <Div className="dashboard-btn-wrapper">
              <Button bsSize="small" onClick={() => this.setState({showMissionForm: true})}>Создать задание</Button>
            </Div> : ''}
          {canCreateDutyMission ?
            <Div className="dashboard-btn-wrapper">
              <Button bsSize="small" onClick={() => this.setState({showDutyMissionForm: true})}>Создать наряд-задание</Button>
            </Div> : ''}
          {/*<Button bsSize="small" style={{marginTop: 10}} onClick={this.showMonitorForm.bind(this)}><Glyphicon glyph="search"/> Монитор</Button>*/}
        </Panel>

        <WaybillFormWrap onFormHide={this.onWaybillFormHide.bind(this)}
                         showForm={this.state.showWaybillForm}
                         element={null}/>

        <MissionFormWrap onFormHide={this.onMissionFormHide.bind(this)}
                         showForm={this.state.showMissionForm}
                         element={null}/>

        <DutyMissionFormWrap onFormHide={this.onDutyMissionFormHide.bind(this)}
                             showForm={this.state.showDutyMissionForm}
                             element={null}/>

        {/*<MonitorFormWrap onFormHide={() => this.setState({showMonitorForm: false})}
                      showForm={this.state.showMonitorForm}
                      {...this.props}/>*/}
      </Div>
    );

  }

}
