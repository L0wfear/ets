import * as React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import ListByTypeMission from 'components/dashboard/menu/cards/current-missions/collapse-list/ListByTypeMission';
import CurrentMissionInfo from 'components/dashboard/menu/cards/current-missions/info/CurrentMissionInfo';

import { IsCurrentMissionsWidget } from 'components/dashboard/menu/cards/current-missions/styled/styled'

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
import { ReduxState } from 'redux-main/@types/state';

class CurrentMissions extends React.Component<PropsCurrentMissions, StateCurrentMissions> {
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
