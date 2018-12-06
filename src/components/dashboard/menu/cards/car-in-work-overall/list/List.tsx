import * as React from 'react';
import * as cx from 'classnames';

import {
  PropsList,
} from 'components/dashboard/menu/cards/car-in-work-overall/list/List.h';

const List: React.FunctionComponent<PropsList> = (props) => (
  <ul>
    {
      props.items.map(({ subItems = [], title, ...item } , index) => (
        <li
          key={index + props.addIndex}
          data-path={index}
          title={item.tooltip || title}
          className={cx(
            {
              'pointer': subItems.length,
              'no-pointer-events': !subItems.length,
            },
            props.classNameContainer,
          )}
          onClick={props.handleClick}
        >
          {title}
        </li>
      ))
    }
  </ul>
);

export default List;
