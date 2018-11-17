import * as React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import ListByTypeCurerntMission from 'components/dashboard/menu/cards/current-missions/collapse-list/ListByTypeCurerntMission';
import CurrentMissionInfo from 'components/dashboard/menu/cards/current-missions/info/CurrentMissionInfo';

import { CurrentMissionsLineDates } from 'components/dashboard/menu/cards/current-missions/styled/styled';

import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  PropsCurrentMissions,
  InnerPropsCurrentMissions,
  StatePropsCurrentMissions,
  DispatchPropsCurrentMissions,
  OwnPropsCurrentMissions,
  StateCurrentMissions,
} from 'components/dashboard/menu/cards/current-missions/CurrentMissions.h';
import {
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

import { ReduxState } from 'redux-main/@types/state';

class CurrentMissions extends React.Component<PropsCurrentMissions, StateCurrentMissions> {
  handleClick = (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => {
    this.props.loadMissionDataById(lastSubItem.id);
  }

  render() {
    return (
      <CurrentMissionsLineDates>
        <ListByTypeCurerntMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={this.handleClick} />
        <ListByTypeCurerntMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={this.handleClick} />
      </CurrentMissionsLineDates>
    );
  }
}

export default compose<PropsCurrentMissions, InnerPropsCurrentMissions>(
  withDefaultCard({
    path: 'current_missions',
    loadData: dashboardLoadCurrentMissions,
    InfoComponent: CurrentMissionInfo,
  }),
  connect<StatePropsCurrentMissions, DispatchPropsCurrentMissions, OwnPropsCurrentMissions, ReduxState>(
    null,
    (dispatch) => ({
      loadMissionDataById: (id) => (
        dispatch(
          dashboardLoadMissionDataForCurrentMission(id),
        )
      ),
    }),
  ),
)(CurrentMissions);
