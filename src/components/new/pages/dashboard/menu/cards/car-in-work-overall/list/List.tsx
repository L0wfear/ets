import * as React from 'react';
import * as cx from 'classnames';

import {
  CarInWorkOverallItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';

type PropsList = {
  items: Array<CarInWorkOverallItemsType>;
  onClick(item: CarInWorkOverallItemsType): void;
  classNameContainer?: string;
};

const List: React.FC<PropsList> = React.memo(
  (props) => {
    const { onClick, items } = props;

    return (
      <ul>
        {items.map(( item, index) => {
          const { subItems = [], title, tooltip } = item;
          const canClick = subItems?.some?.((rowData) => rowData?.subItems?.length);
          const listItemClassName = cx(
            {
              pointer: canClick,
              default_cursor: !canClick,
            },
            props.classNameContainer,
          );
          const handleClick = () => onClick(item);

          return (
            <li
              key={index}
              title={tooltip || title}
              className={listItemClassName}
              onClick={canClick ? handleClick : undefined}
            >
              {title}
            </li>
          );
        })}
      </ul>
    );
  },
);

export default List;

