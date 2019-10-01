import * as React from 'react';

import CollapseListSecondLvl from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/CollapseListSecondLvl/CollapseListSecondLvl';

import CollapseText from 'components/old/ui/collapse/text/CollapseText';
import {
  CurrentDutyMissionsItemsSubItemsType,
  CurrentDutyMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

type Props = {
  collapsetItems: CurrentDutyMissionsItemsSubItemsType[];
  handleClick: (lastSubItem: CurrentDutyMissionsItemsSubItemsSubItemsType) => any;
  classNameContainer?: string;
  index: number;
};

const CollapseListFirstLvl: React.FC<Props> = React.memo(
  (props) => {
    return (
      <ul>
        { props.collapsetItems.map(
          ({ subItems, ...item }, index) => {
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
          })
        }
      </ul>
    );
  },
);

export default CollapseListFirstLvl;
