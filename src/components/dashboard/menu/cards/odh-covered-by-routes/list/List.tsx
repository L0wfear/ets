import * as React from 'react';
import * as cx from 'classnames';

import { PropsList } from 'components/dashboard/menu/cards/odh-covered-by-routes/list/List.h';

const List: React.FunctionComponent<PropsList> = (props) => (
  <ul>
    {
      props.items.map(({ title, subItems = [], ...item }, index) => (
        <li
          key={title}
          data-path={index + props.addIndex}
          className={cx(
            {
              'pointer': subItems.length,
              'no-pointer-events': !subItems.length,
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
