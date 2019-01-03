import * as React from 'react';

import { connect } from 'react-redux';
import DefaultDashboardCardList from 'components/new/pages/dashboard/menu/cards/_default-list/DefaultDashboardCardList';

import CollapseListByLvl from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/CollapseListByLvl';
import { ReduxState } from 'redux-main/@types/state';
import {
  StatePropsListByTypeCurerntMission,
  DispatchPropsListByTypeCurerntMission,
  OwnPropsListByTypeCurerntMission,
  PropsListByTypeCurerntMission,
  StateListByTypeCurerntMission,
} from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/ListByTypeCurerntMission.h';
import { getDashboardState } from 'redux-main/reducers/selectors';

class ListByTypeCurerntMission extends React.PureComponent<PropsListByTypeCurerntMission, StateListByTypeCurerntMission> {
  render() {
    const {
      items = [],
      ...props
    } = this.props;

    return (
      <DefaultDashboardCardList
        title={props.title}
        noClickOnTitle={!items.length}
      >
        <CollapseListByLvl
          collapsetItems={items}
          handleClick={props.handleClick}
        />
      </DefaultDashboardCardList>
    );
  }
}

export default connect<StatePropsListByTypeCurerntMission, DispatchPropsListByTypeCurerntMission, OwnPropsListByTypeCurerntMission, ReduxState>(
  (state, { titleKey, itemsKey } ) => ({
    title: getDashboardState(state).current_missions.data[titleKey],
    items: getDashboardState(state).current_missions.data[itemsKey],
  }),
)(ListByTypeCurerntMission);
