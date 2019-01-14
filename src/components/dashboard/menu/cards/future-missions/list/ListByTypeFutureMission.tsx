import * as React from 'react';

import { connect } from 'react-redux';

import CollapseListFutureMission from 'components/dashboard/menu/cards/future-missions/list/collapse-by-type/CollapseListFutureMission';

import DefaultDashboardCardList from 'components/dashboard/menu/cards/_default-list/DefaultDashboardCardList';
import { ReduxState } from 'redux-main/@types/state';
import {
  StatePropsFutureMissionsList,
  DispatchPropsFutureMissionsList,
  OwnPropsFutureMissionsList,
  PropsListByTypeMission,
  StateListByTypeMission,
} from 'components/dashboard/menu/cards/future-missions/list/ListByTypeFutureMission.h';
import { getDashboardState } from 'redux-main/reducers/selectors';

class ListByTypeMission extends React.Component<PropsListByTypeMission, StateListByTypeMission> {
  render() {
    const {
      items,
      ...props
    } = this.props;

    return (
      <DefaultDashboardCardList
        title={props.title}
        noClickOnTitle={!items.length}
      >
        <CollapseListFutureMission collapsetItems={items} handleClick={props.handleClick} />
      </DefaultDashboardCardList>
    );
  }
}

export default connect<StatePropsFutureMissionsList, DispatchPropsFutureMissionsList, OwnPropsFutureMissionsList, ReduxState>(
  (state, { titleKey, itemsKey } ) => ({
    title: getDashboardState(state).future_missions.data[titleKey],
    items: getDashboardState(state).future_missions.data[itemsKey],
  }),
)(ListByTypeMission);
