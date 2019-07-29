import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { mainInfo } from './formConfig';

type Props = {} & WithSearchProps;

const RedirectCarFormBody: React.FC<Props> = React.memo(
  (props) => {
    React.useEffect(
      () => {
        props.setParams({
          tabKey: mainInfo.tabKey,
        });
      },
      [props.setParams, props.match.params],
    );

    return (
      <div></div>
    );
  },
);

export default withSearch(RedirectCarFormBody);
