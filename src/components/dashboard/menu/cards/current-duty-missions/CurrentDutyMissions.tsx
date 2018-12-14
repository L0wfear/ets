import * as React from 'react';

import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';
import ListByTypeCurerntDutyMission from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/ListByTypeCurerntDutyMission';

import {
  dashboardLoadCurrentDutyMissions,
  dashboardLoadRouteDataForCurrentDutyMissions,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import CurrentDutyMissionInfo from 'components/dashboard/menu/cards/current-duty-missions/info/CurrentDutyMissionsInfo';

import {
  StatePropsCurrentDutyMissions,
  DispatchPropsCurrentDutyMissions,
  OwnPropsCurrentDutyMissions,
  PropsCurrentDutyMissions,
  StateCurrentDutyMissions,
} from 'components/dashboard/menu/cards/current-duty-missions/CurrentDutyMissions.h';
import {
  CurrentDutyMissionsItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { PropsToDefaultCard } from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

class CurrentDutyMissions extends React.Component<PropsCurrentDutyMissions, StateCurrentDutyMissions> {
  handleClick = (lastSubItem: CurrentDutyMissionsItemsSubItemsType) => {
    this.props.routesLoadRouteById(
      lastSubItem.data,
      lastSubItem.data.duty_mission_route_id,
    );
  }

  render() {
    return (
      <div>
        <ListByTypeCurerntDutyMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={this.handleClick} />
        <ListByTypeCurerntDutyMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={this.handleClick} />
      </div>
    );
  }
}

export default compose<PropsCurrentDutyMissions, PropsToDefaultCard>(
  withDefaultCard({
    path: 'current_duty_missions',
    loadData: dashboardLoadCurrentDutyMissions,
    InfoComponent: CurrentDutyMissionInfo,
  }),
  connect<StatePropsCurrentDutyMissions, DispatchPropsCurrentDutyMissions, OwnPropsCurrentDutyMissions, ReduxState>(
    null,
    (dispatch) => ({
      routesLoadRouteById: (duty_mission_data, id) => (
        dispatch(
          dashboardLoadRouteDataForCurrentDutyMissions(
            duty_mission_data,
            id,
          ),
        )
      ),
    }),
  ),
)(CurrentDutyMissions);
