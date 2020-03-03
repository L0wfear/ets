import * as React from 'react';

import LiData from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseListByLvl/LiData/LiData';
import {
  CurrentDutyMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

type Props = {
  collapsetItems: Array<CurrentDutyMissionsItemsSubItemsSubItemsType>;
  handleClick: (lastSubItem: CurrentDutyMissionsItemsSubItemsSubItemsType) => any;
  classNameContainer?: string;
  index: number;
};

const CollapseListSecondLvl: React.FC<Props> = React.memo(
  (props) => {
    return (
      <ul>
        {
          props.collapsetItems.map((subItem) => (
            <LiData key={subItem.data.duty_mission_id} handleClick={props.handleClick} subItem={subItem}/>
          ))
        }
      </ul>
    );
  },
);

export default CollapseListSecondLvl;
