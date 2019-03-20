import * as React from 'react';

import {
  PropsCollapseListSecondLvl,
  StateCollapseListSecondLvl,
} from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/CollapseListSecondLvl/CollapseListSecondLvl.h';

import LiData from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/LiData/LiData';

class CollapseListSecondLvl extends React.PureComponent<PropsCollapseListSecondLvl, StateCollapseListSecondLvl> {
  renderMap = (subItem) => {
    return (
      <LiData key={subItem.id} handleClick={this.props.handleClick} subItem={subItem}/>
    );
  }
  render() {
    const {
      props,
    } = this;

    return (
      <ul>
        { props.collapsetItems.map(this.renderMap) }
      </ul>
    );
  }
}

export default CollapseListSecondLvl;
