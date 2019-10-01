import * as React from 'react';

import CollapseListFirstLvl from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/CollapseListFirstLvl/CollapseListFirstLvl';
import CollapseText from 'components/old/ui/collapse/text/CollapseText';

import { CollapseTitleContainer } from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/styled/styled';
import {
  CurrentDutyMissionsItemsType,
  CurrentDutyMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

type Props = {
  collapsetItems: CurrentDutyMissionsItemsType[];
  handleClick: (lastSubItem: CurrentDutyMissionsItemsSubItemsSubItemsType) => any;
  classNameContainer?: string;
};

const components = {
  CollapseTitleContainer,
};

const CollapseListByLvl: React.FC<Props> = React.memo(
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
          },
        ) }
      </ul>
    );
  },
);

export default CollapseListByLvl;
