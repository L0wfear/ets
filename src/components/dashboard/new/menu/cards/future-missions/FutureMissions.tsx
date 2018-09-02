import * as React from 'react';

import withDefaultCard from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import ListByTypeMission from 'components/dashboard/new/menu/cards/future-missions/list/ListByTypeMission';

import { dashboardLoadFutureMissions } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import { getMissionById }  from 'redux/trash-actions/mission/promise';
import { PermittedMissionFormWrap } from 'components/missions/mission/buttons/buttons';

import {
  PropsFutureMissions,
  StateFutureMissions,
} from 'components/dashboard/new/menu/cards/future-missions/FutureMissions.h';

class FutureMissions extends React.Component<PropsFutureMissions, StateFutureMissions> {
  state = {
    showMissionFormWrap: false,
    elementMissionFormWrap: null,
  }

  handleClick: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const id = Number.parseInt((path as string).split('/').slice(-1)[0])

    getMissionById(id).then(({ mission }) => {
      if (mission) {
        this.setState({
          showMissionFormWrap: true,
          elementMissionFormWrap: mission,
        });
      }
    });
  }

  handleFormHide = () => (
    this.setState({
      showMissionFormWrap: false,
      elementMissionFormWrap: null,
    })
  )

  render() {
    return (
      <div>
        <ListByTypeMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={this.handleClick} />
        <ListByTypeMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={this.handleClick} />
        <PermittedMissionFormWrap
          onFormHide={this.handleFormHide}
          showForm={this.state.showMissionFormWrap}
          element={this.state.elementMissionFormWrap}
          fromDashboard
        />
      </div>
    )
  }
}

export default withDefaultCard({
  path: 'future_missions',
  loadData: dashboardLoadFutureMissions,
})(
  connect(
    null,
  )(FutureMissions)
);