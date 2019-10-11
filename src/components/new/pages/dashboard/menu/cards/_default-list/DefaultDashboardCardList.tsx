import * as React from 'react';

import CollapseText from 'components/old/ui/collapse/text/CollapseText';

import {
  CollapseTitleContainer,
  CollapseContainer,
} from 'components/new/pages/dashboard/menu/cards/_default-list/styled/styled';

type Props = {
  title: string;
  noClickOnTitle?: boolean;
};

const components = {
  CollapseTitleContainer,
  CollapseContainer,
};

const DefaultDashboardCardList: React.FC<Props> = React.memo(
  (props) => {
    return (
      <CollapseText
        title={props.title}
        noClickOnTitle={props.noClickOnTitle}
        components={components}
      >
        { props.children }
      </CollapseText>
    );
  },
);

export default DefaultDashboardCardList;
