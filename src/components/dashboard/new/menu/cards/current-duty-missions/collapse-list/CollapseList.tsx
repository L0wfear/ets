import * as React from 'react';

import CollapseText from 'components/ui/collapse/text/CollapseText';

type PropsCollapseList = {
  collapsetItems: any[];
  handleClickMission: any;
  classNameContainer?: string;
}

const CollapseList: React.SFC<PropsCollapseList> = props => (
  <div>
    {
      props.collapsetItems.map((item, index) => (
        <CollapseText key={item.title.split(' ').map(word => word[0]).join('')} title={item.title} dependentData={item} {...props}>
          <ul>
          {
            item.subItems.map(({ title, data }, subItemIndex) => (
              <li key={data.duty_mission_id} data-path={`${index}/${subItemIndex}/${data.duty_mission_route_id}`} className="pointer" onClick={props.handleClickMission}>{title}</li>
            ))
          }
          </ul>
        </CollapseText>
      ))
    }
  </div>
);
               
export default CollapseList;