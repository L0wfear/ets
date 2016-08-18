import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import {getFormattedDateTimeSeconds} from 'utils/dates';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import moment from 'moment';
import MissionFormWrap from '../../missions/mission/MissionFormWrap.jsx';


export default class CurrentMission extends DashboardCardMedium {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showMissionForm: false,
      selectedMission: null,
    });
  }

  action(itemIndex) {
    let canView = this.context.flux.getStore('session').getPermission("mission.read");
    if (canView) this.context.flux
      .getActions('missions')
      .getMissionById(this.props.items[itemIndex].mission_id)
      .then(m => {
        this.setState({selectedMission: m.result[0], showMissionForm: true});
      });
  }

  renderCustomCardForm() {
    return (
      <MissionFormWrap
          onFormHide={() => this.setState({showMissionForm: false})}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
          {...this.props}/>
    );
  }

}
