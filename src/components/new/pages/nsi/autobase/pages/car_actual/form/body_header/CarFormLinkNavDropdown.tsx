import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DefaultOwnPropsToBodyRoute } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';

type Props = DefaultOwnPropsToBodyRoute & WithSearchProps;

type PropsFromBootstrap = {
  onSelect: (tabKey: string, event: any) => any;
};

const CarFormLink: React.FC<Props> = React.memo(
  (props) => {
    const {
      title,
      tabKey,
    } = props;
    const isActive = props.match.params.tabKey === tabKey;

    const handleClick = React.useCallback(
      (e) => {
        e.preventDefault();
        (props as Props & PropsFromBootstrap).onSelect(tabKey, e);
        props.setParams({
          tabKey,
        });
      },
      [tabKey, props.setParams, props.match.params],
    );

    return (
      <li role="presentation" className={isActive ? 'active' : undefined }>
        <a role="menuitem" onClick={handleClick}>{title}</a>
      </li>
    );
  },
);

export default withSearch<DefaultOwnPropsToBodyRoute>(CarFormLink);
