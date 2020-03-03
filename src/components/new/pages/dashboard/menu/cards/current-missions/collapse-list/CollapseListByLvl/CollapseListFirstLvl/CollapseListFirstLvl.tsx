import * as React from 'react';

import CollapseListSecondLvl from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/CollapseListSecondLvl/CollapseListSecondLvl';
import CollapseText from 'components/old/ui/collapse/text/CollapseText';

import {
  CurrentMissionsItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

type Props = {
  collapsetItems: Array<CurrentMissionsItemsSubItemsType>;
  handleClick: (lastSubItem: ValuesOf<CurrentMissionsItemsSubItemsType['subItems']>) => any;
};

const CollapseListFirstLvl: React.FC<Props> = React.memo(
  (props) => {
    return (
      <ul>
        {
          props.collapsetItems.map(({ subItems, ...item }, index) => {
            return (
              <li key={index} >
                <CollapseText
                  title={item.title}
                  noClickOnTitle={!subItems.length}
                >
                  <CollapseListSecondLvl
                    collapsetItems={subItems}
                    handleClick={props.handleClick}
                  />
                </CollapseText>
              </li>
            );
          }) }
      </ul>
    );
  },
);

export default CollapseListFirstLvl;
