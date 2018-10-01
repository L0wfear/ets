import * as React from 'react';

import { connect } from 'react-redux';
import withDefaultCard from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import ListByTypeMission from 'components/dashboard/new/menu/cards/current-missions/collapse-list/ListByTypeMission';
import CurrentMissionInfo from 'components/dashboard/new/menu/cards/current-missions/info/CurrentMissionInfo';

import { IsCurrentMissionsWidget } from 'components/dashboard/new/menu/cards/current-missions/styled/styled'

import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/dashboard/new/redux-main/modules/dashboard/actions-dashboard';

import { PropsCurrentMissions } from 'components/dashboard/new/menu/cards/current-missions/CurrentMissions.h';

class CurrentMissions extends React.Component<PropsCurrentMissions, {}> {
  handleClick: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const id = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.loadMissionDataById(id);
  }

  render() {
    return (
      <IsCurrentMissionsWidget>
        <ListByTypeMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={this.handleClick} />
        <ListByTypeMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={this.handleClick} />
      </IsCurrentMissionsWidget>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadMissionDataById: (id) => (
    dispatch(
      dashboardLoadMissionDataForCurrentMission(id),
    )
  ),
});

export default withDefaultCard({
  path: 'current_missions',
  loadData: dashboardLoadCurrentMissions,
  InfoComponent: CurrentMissionInfo,
})(
  connect(
    null,
    mapDispatchToProps,
  )(CurrentMissions)
);
