import * as React from 'react';

import { ExtDiv } from 'components/ui/Div';

interface IPropsTabContent {
  readonly eventKey: string;
  tabKey: string;
  children?: any;
}

const TabContent: React.FunctionComponent<IPropsTabContent> = (props) =>
  <ExtDiv hidden={props.eventKey !== props.tabKey}>
    {props.children}
  </ExtDiv>;

export default TabContent;
