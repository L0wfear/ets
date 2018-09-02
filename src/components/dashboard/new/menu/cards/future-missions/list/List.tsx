import * as React from 'react';
import * as cx from 'classnames';

import {
  PropsList,
} from 'components/dashboard/new/menu/cards/future-missions/list/List.h';

const List: React.SFC<PropsList> = props => (
  <ul>
    {
      props.items.map(({ mission_id, title, ...item }, index) => (
        <li
          key={mission_id}
          data-path={`${mission_id}`}
          title={item.tooltip || title}
          className={cx(
            {
              pointer: mission_id,
              'no-pointer-events': !mission_id,
            },
            props.classNameContainer
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