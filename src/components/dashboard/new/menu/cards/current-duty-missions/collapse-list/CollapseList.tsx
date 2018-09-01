import * as React from 'react';
import * as cx from 'classnames';

import CollapseText from 'components/ui/collapse/text/CollapseText';

type PropsCollapseList = {
  collapsetItems: any[];
  handleClickMission: any;
  classNameContainer?: string;
  path: string;
};

const ListFirstLine: React.SFC<any> = (props) => (
  <ul>
  {
    props.collapsetItems.map(({ title, ...subItem }, index) => (
      <li key={title} data-path={`${props.path}/${index}`} className="pointer" onClick={props.handleClickMission}>{title}</li>
    ))
  }
  </ul>
);

const CollapseList: React.SFC<PropsCollapseList> = props => {
  return (
  <ul>
    {
      props.collapsetItems.map(({ subItems = [], ...item }, index) => (
        <li key={item.title} >
          <CollapseText title={item.title} dependentData={item} classNameContainer={cx( 'initial_font_weight', { pointer: subItems.length, 'no-pointer-events': !subItems.length })} {...props}>
            <ListFirstLine collapsetItems={subItems} path={`${props.path}/${index}`} handleClickMission={props.handleClickMission} />
          </CollapseText>
        </li>
      ))
    }
  </ul>
);
}
               
export default CollapseList;