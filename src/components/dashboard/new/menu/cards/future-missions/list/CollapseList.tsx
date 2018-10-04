import * as React from 'react';

import { PropsCollapseList } from 'components/dashboard/new/menu/cards/future-missions/list/@types/CollapseList.h';

const CollapseList: React.SFC<PropsCollapseList> = props => (
  <ul>
    {
      props.collapsetItems.map(({ id, ...item }, index) => (
        <li
          key={id}
          data-path={id}
          className="pointer initial_font_weight"
          onClick={props.handleClick}
        >
          {item.name}
        </li>
      ))
    }
  </ul>
);
               
export default CollapseList;