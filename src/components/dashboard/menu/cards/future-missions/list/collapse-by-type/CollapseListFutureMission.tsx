import * as React from 'react';

import FutureMissionLiData from 'components/dashboard/menu/cards/future-missions/list/LiData/FutureMissionLiData';

import {
  PropsCollapseListFutureMission,
  StateCollapseListFutureMission,
} from 'components/dashboard/menu/cards/future-missions/list/collapse-by-type/CollapseListFutureMission.h';

class CollapseListFutureMission extends  React.PureComponent<PropsCollapseListFutureMission, StateCollapseListFutureMission> {
  renderMap = (item) => (
    <FutureMissionLiData key={item.id} item={item} handleClick={this.props.handleClick}/>
  );

  render() {
    const { props } = this;

    return (
      <ul>
        {
          props.collapsetItems.map(this.renderMap)
        }
      </ul>
    );
  }
}
               
export default CollapseListFutureMission;
