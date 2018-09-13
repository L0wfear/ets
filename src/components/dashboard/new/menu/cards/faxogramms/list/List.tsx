import * as React from 'react';
import * as cx from 'classnames';

import { PropsList } from 'components/dashboard/new/menu/cards/faxogramms/list/List.h';

const List: React.SFC<PropsList> = props => (
  <ul>
    {
      props.items.map(({ subItems = [], title, ...item } , index) => (
        <li
          key={index}
          data-path={index}
          className={cx(
            {
              pointer: subItems.length,
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