import * as React from 'react';

import {
  PropsCollapseListByLvl,
  StateCollapseListByLvl,
} from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/CollapseListByLvl.h';
import {
  CurrentDutyMissionsItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

import CollapseListFirstLvl from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/CollapseListFirstLvl/CollapseListFirstLvl';
import CollapseText from 'components/ui/collapse/text/CollapseText';

import { CollapseTitleContainer } from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/styled/styled';

const components = {
  CollapseTitleContainer,
};

class CollapseListByLvl extends React.PureComponent<PropsCollapseListByLvl, StateCollapseListByLvl> {
  rednerMap = ({ subItems, ...item }: CurrentDutyMissionsItemsType, index) => {
    const { props } = this;
    
    return (
      <li key={index} >
        <CollapseText
          title={item.title} 
          noClickOnTitle={!subItems.length}
          components={components}
        >
          <CollapseListFirstLvl
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
      props
    } = this;

    return (
      <ul>
        { props.collapsetItems.map(this.rednerMap) }
      </ul>
    )
  }
}

export default CollapseListByLvl;