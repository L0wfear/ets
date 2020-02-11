import * as React from 'react';
import * as cx from 'classnames';

import { CarInWorkOverallItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';

type PropsList = {
  item: CarInWorkOverallItemsType;
  onClick(item: CarInWorkOverallItemsType): void;
  classNameContainer?: string;
  canClick: boolean;
};

const ListItem: React.FC<PropsList> = React.memo((props) => {
  const { item, onClick, canClick } = props;

  const { title, tooltip } = item;
  const listItemClassName = cx(
    {
      pointer: canClick,
      default_cursor: !canClick,
    },
    props.classNameContainer,
  );

  const handleClick = (_item: PropsList['item']) => (): void => canClick ? onClick(_item) : undefined;

  const currentTitle = tooltip || title;

  return (
    <li
      title={currentTitle}
      className={listItemClassName}
      onClick={handleClick(item)}
    >
      {title}
    </li>
  );
});

export default ListItem;
