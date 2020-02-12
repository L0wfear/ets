import * as React from 'react';
import * as cx from 'classnames';

import { CarInWorkOverallItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';

type Props = {
  item: CarInWorkOverallItemsType;
  onClick(item: CarInWorkOverallItemsType): void;
  classNameContainer?: string;
  canClick: boolean;
};

const ListItem: React.FC<Props> = React.memo((props) => {
  const { item, canClick } = props;

  const { title, tooltip } = item;
  const listItemClassName = cx(
    {
      pointer: canClick,
      default_cursor: !canClick,
    },
    props.classNameContainer,
  );

  const handleClick = React.useCallback(
    () => {
      if (canClick) {
        props.onClick(props.item);
      }
    },
    [props.onClick, props.item],
  );

  const currentTitle = tooltip || title;

  return (
    <li
      title={currentTitle}
      className={listItemClassName}
      onClick={handleClick}
    >
      {title}
    </li>
  );
});

export default ListItem;
