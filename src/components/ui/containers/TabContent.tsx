import * as React from 'react';

import { ExtDiv } from 'components/ui/Div';

interface IPropsTabContent {
  readonly eventKey: 'string';
  tabKey: 'string';
}

const TabContent: React.SFC<IPropsTabContent> = props =>
  <ExtDiv hidden={props.eventKey !== props.tabKey}>
    {props.children}
  </ExtDiv>;

export default TabContent;
