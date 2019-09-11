import * as React from 'react';

import LiData from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/LiData/LiData';

import {
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

type Props = {
  collapsetItems: CurrentMissionsItemsSubItemsSubItemsType[];
  handleClick: (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => any;
  classNameContainer?: string;
  index: number;
};

const CollapseListSecondLvl: React.FC<Props> = React.memo(
  (props) => {
    return (
      <ul>
        {
          props.collapsetItems.map((subItem) => (
            <LiData key={subItem.id} handleClick={props.handleClick} subItem={subItem}/>
          ))
        }
      </ul>
    );
  },
);

export default CollapseListSecondLvl;
