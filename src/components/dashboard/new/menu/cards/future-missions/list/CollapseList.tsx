import * as React from 'react';

type PropsCollapseList = {
  collapsetItems: any[];
  handleClickMission: any;
  classNameContainer?: string;
};

const CollapseList: React.SFC<PropsCollapseList> = props => (
  <ul>
    {
      props.collapsetItems.map(({ id, ...item }, index) => (
        <li key={id} data-path={`${id}`} className="pointer initial_font_weight" onClick={props.handleClickMission}>{item.name}</li>
      ))
    }
  </ul>
);
               
export default CollapseList;