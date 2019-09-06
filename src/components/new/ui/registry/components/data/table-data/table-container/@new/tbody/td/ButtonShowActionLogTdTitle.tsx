import * as React from 'react';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = CommontTdTiteProps;
type Props = OwnProps & WithSearchProps;

const ButtonShowActionLogTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const uniqValue = rowData[uniqKey] || null;

    const handleClick = React.useCallback(
      async () => {
        props.setParams({
          [uniqKeyForParams]: uniqValue,
        });
      },
      [rowData, props.setParams, uniqKeyForParams, uniqValue],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>
        <EtsBootstrap.Button block onClick={handleClick}>Открыть историю</EtsBootstrap.Button>
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default withSearch<OwnProps>(ButtonShowActionLogTdTitle);
