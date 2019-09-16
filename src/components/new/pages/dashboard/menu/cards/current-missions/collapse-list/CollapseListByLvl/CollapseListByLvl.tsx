import * as React from 'react';

import CollapseListFirstLvl from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/CollapseListFirstLvl/CollapseListFirstLvl';
import CollapseText from 'components/old/ui/collapse/text/CollapseText';

import { CollapseTitleContainer } from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/styled/styled';

import {
  CurrentMissionsItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

type Props = {
  collapsetItems: CurrentMissionsItemsType[];
  handleClick: (lastSubItem: ValuesOf<ValuesOf<CurrentMissionsItemsType['subItems']>['subItems']>) => any;
  classNameContainer?: string;
};

const components = {
  CollapseTitleContainer,
};

const CollapseListByLvl: React.FC<Props> = React.memo(
  (props) => {
    return (
      <ul>
        {
          props.collapsetItems.map(({ subItems, ...item }, index) => (
            <li key={index} >
              <CollapseText
                title={item.title}
                noClickOnTitle={!subItems.length}
                components={components}
              >
                <CollapseListFirstLvl
                  collapsetItems={subItems}
                  handleClick={props.handleClick}
                />
              </CollapseText>
            </li>
          ))
        }
      </ul>
    );
  },
);

export default CollapseListByLvl;
