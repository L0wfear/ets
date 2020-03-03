import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { mainInfo } from './formConfig';

type OwnProps = {};
type Props = OwnProps & WithSearchProps;

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

    return null;
  },
);

export default withSearch<OwnProps>(RedirectCarFormBody);
