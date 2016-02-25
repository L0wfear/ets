import React from 'react';
import Div from '../ui/Div.jsx';
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import MissionFormWrap from '../missions/MissionFormWrap.jsx';
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

  render() {

    return (
      <Div className="dashboard-card-sm" hidden={this.props.hidden}>
        <Panel header={'Управление'} bsStyle="success">
          <Button onClick={this.showForm.bind(this)}><Glyphicon glyph="plus"/> Создать задание</Button>
        </Panel>
        <MissionFormWrap onFormHide={this.onFormHide.bind(this)}
                         showForm={this.state.showForm}
                         element={this.state.selectedElement}/>
      </Div>
    );

  }

}
