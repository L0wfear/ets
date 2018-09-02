import * as React from 'react';

import CollapseText from 'components/ui/collapse/text/CollapseText';

import {
  PropsCollapseList,
} from 'components/dashboard/new/menu/cards/current-missions/collapse-list/CollapseList.h';

const CollapseList: React.SFC<PropsCollapseList> = (props) => (
  <div>
    {
      props.collapsetItems.map(({ title, ...item }, index) => (
        <CollapseText key={title} title={title} dependentData={item} {...props}>
          <ul>
          {
            item.subItems.map(({ id, ...subItem }) => (
              <li
                key={id}
                data-path={`${index}/${id}`}
                className="pointer"
                onClick={props.handleClick}
              >
                {subItem.title}
              </li>
            ))
          }
          </ul>
        </CollapseText>
      ))
    }
  </div>
);
               
export default CollapseList;