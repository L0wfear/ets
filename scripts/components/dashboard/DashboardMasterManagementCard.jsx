import React from 'react';
import Div from '../ui/Div.jsx';
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import MissionFormWrap from '../missions/MissionFormWrap.jsx';
import MonitorFormWrap from './MonitorFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';

export default class MasterManagementCard extends ElementsList {

  constructor(props) {
    super(props);
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

  render() {

    return (
      <Div className="dashboard-card-sm" hidden={this.props.hidden}>
        <Panel header={'Управление'} bsStyle="success">
          <Button bsSize="small" onClick={this.showForm.bind(this)}><Glyphicon glyph="plus"/> Создать задание</Button>
          {/*<Button bsSize="small" style={{marginTop: 10}} onClick={this.showMonitorForm.bind(this)}><Glyphicon glyph="search"/> Монитор</Button>*/}
        </Panel>
        <MissionFormWrap onFormHide={this.onFormHide.bind(this)}
                         showForm={this.state.showForm}
                         element={this.state.selectedElement}/>

        <MonitorFormWrap onFormHide={() => this.setState({showMonitorForm: false})}
                      showForm={this.state.showMonitorForm}
                      {...this.props}/>
      </Div>
    );

  }

}
