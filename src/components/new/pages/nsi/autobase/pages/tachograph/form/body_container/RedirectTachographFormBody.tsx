import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { main } from './formConfig';

type OwnProps = {};
type Props = OwnProps & WithSearchProps;

const RedirectTachographFormBody: React.FC<Props> = React.memo(
  (props) => {
    React.useEffect(
      () => {
        props.setParams({
          tabKey: main.tabKey,
        });
      },
      [props.setParams, props.match.params],
    );

    return null;
  },
);

export default withSearch<OwnProps>(RedirectTachographFormBody);
