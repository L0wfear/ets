import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { DefaultOwnPropsToBodyRoute } from 'components/new/pages/nsi/autobase/pages/tachograph/form/@types/TachographForm';

type Props = DefaultOwnPropsToBodyRoute & WithSearchProps;

const TachographFormLink: React.FC<Props> = React.memo(
  (props) => {
    const {
      isActive,
      title,
      tabKey,
    } = props;

    const handleClick = React.useCallback(
      () => {
        props.setParams({
          tabKey,
        });
      },
      [tabKey, props.setParams, props.match.params],
    );

    return (
      <EtsBootstrap.NavItem role="button" active={isActive} onClick={handleClick}>
        {title}
      </EtsBootstrap.NavItem>
    );
  },
);

export default withSearch<DefaultOwnPropsToBodyRoute>(TachographFormLink);
