import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { DefaultOwnPropsToBodyRoute } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import { DivNone } from 'global-styled/global-styled';

type Props = DefaultOwnPropsToBodyRoute & WithSearchProps;

const CarFormLink: React.FC<Props> = React.memo(
  (props) => {
    const {
      isActive,
      title,
      tabKey,
      showTabIntoNav,
    } = props;

    const handleClick = React.useCallback(
      () => {
        props.setParams({
          tabKey,
        });
      },
      [tabKey, props.setParams, props.match.params],
    );
    if (!showTabIntoNav) {
      return <DivNone />;
    }
    return (
      <EtsBootstrap.NavItem role="button" active={isActive} onClick={handleClick}>
        {title}
      </EtsBootstrap.NavItem>
    );
  },
);

export default withSearch<DefaultOwnPropsToBodyRoute>(CarFormLink);
