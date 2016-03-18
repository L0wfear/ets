import React from 'react';
import Div from '../ui/Div.jsx';
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import MissionFormWrap from '../missions/MissionFormWrap.jsx';
import MonitorFormWrap from './MonitorFormWrap.jsx';
import WaybillFormWrap from '../waybill/WaybillFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';

export default class MasterManagementCard extends ElementsList {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showWaybillForm: false,
    })
  }

  componentDidMount() {
		const { flux } = this.context;
    flux.getActions('objects').getTechOperations();
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

  render() {

    return (
      <Div className="dashboard-card-sm" hidden={this.props.hidden}>
        <Panel header={'Управление'} bsStyle="success">
          <Button bsSize="small" onClick={() => this.setState({showWaybillForm: true})}>Новый путевой лист</Button>
          <div style={{marginTop: 20}}/>
          <Button bsSize="small" onClick={this.showForm.bind(this)}>Новое задание</Button>
          {/*<Button bsSize="small" style={{marginTop: 10}} onClick={this.showMonitorForm.bind(this)}><Glyphicon glyph="search"/> Монитор</Button>*/}
        </Panel>

        <WaybillFormWrap onFormHide={this.onWaybillFormHide.bind(this)}
                         showForm={this.state.showWaybillForm}
                         element={null}/>

        <MissionFormWrap onFormHide={this.onFormHide.bind(this)}
                         showForm={this.state.showForm}
                         element={this.state.selectedElement}/>

        {/*<MonitorFormWrap onFormHide={() => this.setState({showMonitorForm: false})}
                      showForm={this.state.showMonitorForm}
                      {...this.props}/>*/}
      </Div>
    );

  }

}
