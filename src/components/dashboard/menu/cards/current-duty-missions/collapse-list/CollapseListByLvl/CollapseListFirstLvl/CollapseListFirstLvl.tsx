import * as React from 'react';

import {
  PropsCollapseListFirstLvl,
  StateCollapseListFirstLvl,
} from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/CollapseListFirstLvl/CollapseListFirstLvl.h';

import {
  CurrentDutyMissionsItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

import LiData from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/LiData/LiData';

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
