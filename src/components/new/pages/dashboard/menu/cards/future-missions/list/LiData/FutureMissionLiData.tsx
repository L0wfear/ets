import * as React from 'react';

import { FutureMissionsItemsByTypeType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/future-mission.h';

type Props = {
  item: FutureMissionsItemsByTypeType;
  handleClick: (id: number) => any;
};

const FutureMissionLiData: React.FC<Props> = React.memo(
  (props) => {
    const handleClick = React.useCallback(
      () => {
        props.handleClick(
          props.item.id,
        );
      },
      [props],
    );

    return (
      <li className="pointer initial_font_weight" onClick={handleClick}>
        {props.item.name}
      </li>
    );
  },
);

export default FutureMissionLiData;
