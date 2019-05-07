import * as React from 'react';
import * as cx from 'classnames';

import { PropsList } from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/list/List.h';

const List: React.FC<PropsList> = (props) => (
  <ul>
    {
      props.items.map(({ sub_items = [], title, ...item }, index) => (
        <li
          key={title}
          data-path={index + props.addIndex}
          className={cx(
            {
              'pointer': sub_items.length,
              'no-pointer-events': !sub_items.length,
            },
            props.classNameContainer,
          )}
          onClick={props.handleClick}
          title={item.tooltip || title}
        >
          {title}
        </li>
      ))
    }
  </ul>
);

export default List;
