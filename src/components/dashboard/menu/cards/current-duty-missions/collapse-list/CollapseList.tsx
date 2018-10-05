import * as React from 'react';

import CollapseText from 'components/ui/collapse/text/CollapseText';

import {
  PropsCollapseList,
} from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseList.h';

const CollapseList: React.SFC<PropsCollapseList> = props => (
  <div>
    {
      props.collapsetItems.map(({ title, ...item }, index) => (
        <CollapseText key={title} title={title} dependentData={item} {...props}>
          <ul>
          {
            item.subItems.map(({ title, data }, subItemIndex) => (
              <li
                key={data.duty_mission_id}
                data-path={`${index}/${subItemIndex}/${data.duty_mission_route_id}`}
                className="pointer"
                onClick={props.handleClickMission}
              >
                {title}
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