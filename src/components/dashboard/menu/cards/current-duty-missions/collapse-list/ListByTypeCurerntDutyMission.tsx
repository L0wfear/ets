import * as React from 'react';

import { connect } from 'react-redux';
import DefaultDashboardCardList from 'components/dashboard/menu/cards/_default-list/DefaultDashboardCardList';

import CollapseListByLvl from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/CollapseListByLvl';
import { ReduxState } from 'redux-main/@types/state';
import {
  StatePropsListByTypeCurrentDutyMission,
  DispatchPropsListByTypeCurrentDutyMission,
  OwnPropsListByTypeCurrentDutyMission,
  PropsListByTypeCurrentDutyMission,
  StateListByTypeCurrentDutyMission,
} from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/ListByTypeCurrentDutyMission.h';
import { getDashboardState } from 'redux-main/reducers/selectors';

class ListByTypeCurrentDutyMission extends React.PureComponent<PropsListByTypeCurrentDutyMission, StateListByTypeCurrentDutyMission> {
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
          handleClick={this.props.handleClick}
        />
      </DefaultDashboardCardList>
    );
  }
}

export default connect<StatePropsListByTypeCurrentDutyMission, DispatchPropsListByTypeCurrentDutyMission, OwnPropsListByTypeCurrentDutyMission, ReduxState>(
  (state, { titleKey, itemsKey } ) => ({
    title: getDashboardState(state).current_duty_missions.data[titleKey],
    items: getDashboardState(state).current_duty_missions.data[itemsKey],
  }),
)(ListByTypeCurrentDutyMission);
