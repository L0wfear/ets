import * as React from 'react';

import CollapseListSecondLvl from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/CollapseListSecondLvl/CollapseListSecondLvl';

import {
  PropsCollapseListFirstLvl,
  StateCollapseListFirstLvl,
} from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/CollapseListFirstLvl/CollapseListFirstLvl.h';
import CollapseText from 'components/old/ui/collapse/text/CollapseText';

class CollapseListFirstLvl extends React.PureComponent<PropsCollapseListFirstLvl, StateCollapseListFirstLvl> {
  renderMap = ({ subItems, ...item }, index) => {
    const { props } = this;

    return (
      <li key={index} >
        <CollapseText
          title={item.title}
          noClickOnTitle={!subItems.length}
        >
          <CollapseListSecondLvl
            collapsetItems={subItems}
            handleClick={props.handleClick}
            index={index}
          />
        </CollapseText>
      </li>
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

export default CollapseListFirstLvl;
