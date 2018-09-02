import * as React from 'react';

import withDefaultCard from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';
import ListByTypeMission from 'components/dashboard/new/menu/cards/current-duty-missions/collapse-list/ListByTypeMission';

import {
  dashboardLoadCurrentDutyMissions,
  dashboardLoadRouteDataForCurrentDutyMissions,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';

import CurrentDutyMissionInfo from 'components/dashboard/new/menu/cards/current-duty-missions/info/CurrentDutyMissionsInfo';

import {
  PropsCurrentDutyMissions,
  StateCurrentDutyMissions,
} from 'components/dashboard/new/menu/cards/current-duty-missions/CurrentDutyMissions.h';

class CurrentDutyMissions extends React.Component<PropsCurrentDutyMissions, StateCurrentDutyMissions> {
  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const [
      itemsKey,
      subItemsIndex,
      dataIndex,
    ] = path.split('/');

    // items_centralized | items_decentralized
    const duty_mission_data = this.props[itemsKey][subItemsIndex].subItems[dataIndex].data;

    this.props.loadRouteDataById(
      duty_mission_data,
      duty_mission_data.duty_mission_route_id,
    );
  }

  render() {
    return (
      <div>
        <ListByTypeMission titleKey="title_centralized" itemsKey="items_centralized" handleClickMission={this.handleClickMission} />
        <ListByTypeMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClickMission={this.handleClickMission} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  items_centralized: state.dashboard.current_duty_missions.data.items_centralized,
  items_decentralized: state.dashboard.current_duty_missions.data.items_decentralized,
});

const mapDispatchToProps = (dispatch) => ({
  loadRouteDataById: (duty_mission_data, id) => (
    dispatch(
      dashboardLoadRouteDataForCurrentDutyMissions(duty_mission_data, id),
    )
  )
});

export default withDefaultCard({
  path: 'current_duty_missions',
  loadData: dashboardLoadCurrentDutyMissions,
  InfoComponent: CurrentDutyMissionInfo,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CurrentDutyMissions)
);