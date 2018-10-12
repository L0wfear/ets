import * as React from 'react';
import * as cx from 'classnames';

import CollapseText from 'components/ui/collapse/text/CollapseText';

import {
  PropsCollapseList,
} from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseList.h';

const ListFirstLine: React.SFC<any> = (props) => (
  <ul>
  {
    props.collapsetItems.map(({ title, ...subItem }, index) => (
      <li key={title} data-path={`${props.path}/${index}`} className="pointer" onClick={props.handleClickMission}>{title}</li>
    ))
  }
  </ul>
);

const CollapseList: React.SFC<PropsCollapseList> = (props) => (
  <ul>
    {
      props.collapsetItems.map(({ subItems = [], ...item }, index) => (
        <li key={item.title} >
          <CollapseText
            title={item.title}
            classNameTitle="bold"
            classNameContainer={cx(
              {
                pointer: subItems.length,
                'no-pointer-events': !subItems.length,
              },
              'initial_font_weight',
            )}
            {...props}
          >
            <ListFirstLine
              collapsetItems={subItems}
              path={`${props.path}/${index}`}
              handleClickMission={props.handleClickMission}
            />
          </CollapseText>
        </li>
      ))
    }
  </ul>
);
               
export default CollapseList;