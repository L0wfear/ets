import React from 'react';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import MissionFormWrap from '../../missions/mission/MissionFormWrap.jsx';

export default class FutureMissions extends DashboardCardMedium {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showMissionForm: false,
      selectedMission: null,
    });
  }

  action(itemIndex) {
    const canView = this.context.flux.getStore('session').getPermission('mission.read');
    if (canView) {
      this.context.flux
      .getActions('missions')
      .getMissionById(this.props.items[itemIndex].mission_id)
      .then((m) => {
        this.setState({ selectedMission: m.result.rows[0], showMissionForm: true });
      });
    }
  }

  renderCustomCardForm() {
    return (
      <MissionFormWrap
        onFormHide={() => this.setState({ showMissionForm: false })}
        showForm={this.state.showMissionForm}
        element={this.state.selectedMission}
        {...this.props}
      />
    );
  }

}
