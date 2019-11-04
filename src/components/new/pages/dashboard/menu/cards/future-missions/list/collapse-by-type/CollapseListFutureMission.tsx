import * as React from 'react';

import FutureMissionLiData from 'components/new/pages/dashboard/menu/cards/future-missions/list/LiData/FutureMissionLiData';
import { FutureMissionsItemsByTypeType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/future-mission.h';

type Props = {
  handleClick: (id: number) => any;
  collapsetItems: Array<FutureMissionsItemsByTypeType>;
};

const CollapseListFutureMission: React.FC<Props> = React.memo(
  (props) => {
    return (
      <ul>
        {
          props.collapsetItems.map((item) => (
            <FutureMissionLiData key={item.id} item={item} handleClick={props.handleClick}/>
          ))
        }
      </ul>
    );
  },
);

export default CollapseListFutureMission;
