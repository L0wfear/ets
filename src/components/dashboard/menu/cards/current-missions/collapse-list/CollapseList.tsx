import * as React from 'react';
import * as cx from 'classnames';

import CollapseText from 'components/ui/collapse/text/CollapseText';

import {
  PropsCollapseList,
} from 'components/dashboard/menu/cards/current-missions/collapse-list/CollapseList.h';

const ListSecondLine: React.SFC<any> = (props) => (
  <ul>
    {
      props.collapsetItems.map(({ id, ...subItem }) => (
        <li key={id} data-path={`${props.path}/${id}`} className="pointer" onClick={props.handleClick}>{subItem.title}</li>
      ))
    }
  </ul>
);

const ListFirstLine: React.SFC<any> = (props) => (
  <ul>
    {
      props.collapsetItems.map(({ subItems = [], ...item }, index) => (
        <li key={item.title.split(' ').map(word => word[0]).join('')} >
          <CollapseText title={item.title} dependentData={item} classNameContainer={cx({ pointer: subItems.length, 'no-pointer-events': !subItems.length })} {...props}>
            <ListSecondLine collapsetItems={subItems} path={`${props.path}/${index}`} handleClick={props.handleClick} />
          </CollapseText>
        </li>
      ))
    }
  </ul>
);

const CollapseList: React.SFC<PropsCollapseList> = props => (
  <ul>
    {
      props.collapsetItems.map(({ subItems = [], ...item }, index) => (
        <li key={item.title.split(' ').map(word => word[0]).join('')} >
          <CollapseText title={item.title} dependentData={item} classNameContainer={cx('initial_font_weight', { pointer: subItems.length, 'no-pointer-events': !subItems.length })} {...props}>
            <ListFirstLine collapsetItems={subItems} path={index} handleClick={props.handleClick} />
          </CollapseText>
        </li>
      ))
    }
  </ul>
);
               
export default CollapseList;