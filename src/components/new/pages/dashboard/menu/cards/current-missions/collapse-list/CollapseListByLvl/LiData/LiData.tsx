import * as React from 'react';

import {
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

type Props = {
  subItem: CurrentMissionsItemsSubItemsSubItemsType;
  handleClick: (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => any;
};

const LiData: React.FC<Props> = React.memo(
  (props) => {
    const handleClick = React.useCallback(
      () => {
        props.handleClick(
          props.subItem,
        );
      },
      [props.handleClick, props.subItem],
    );

    return (
      <li className="pointer" onClick={handleClick}>{props.subItem.title}</li>
    );
  },
);

export default LiData;
