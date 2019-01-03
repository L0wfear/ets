import * as React from 'react';

import {
  PropsCollapseListFirstLvl,
  StateCollapseListFirstLvl,
} from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/CollapseListFirstLvl/CollapseListFirstLvl.h';

import {
  CurrentDutyMissionsItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

import LiData from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/LiData/LiData';

class CollapseListFirstLvl extends React.PureComponent<PropsCollapseListFirstLvl, StateCollapseListFirstLvl> {
  rednerMap = (subItem: CurrentDutyMissionsItemsSubItemsType) => {
    return (
      <LiData key={subItem.data.duty_mission_id} handleClick={this.props.handleClick} subItem={subItem}/>
    );
  }

  render() {
    const {
      props,
    } = this;

    return (
      <ul>
        { props.collapsetItems.map(this.rednerMap) }
      </ul>
    );
  }
}

export default CollapseListFirstLvl;
