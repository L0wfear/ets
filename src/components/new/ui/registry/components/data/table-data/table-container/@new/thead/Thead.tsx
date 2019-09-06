import * as React from 'react';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import Tr from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/Tr';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = {
  registryKey: string;
};

const Thead: React.FC<Props> = React.memo(
  (props) => {
    const fieldsInDeepArr = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.fieldsInDeepArr);

    return (
      <EtsBootstrap.Grid.GridBootstrapThead.Thead>
        {
          fieldsInDeepArr.map(
            (_, index) => (
              <Tr key={index} indexRow={index} registryKey={props.registryKey} />
            ),
          )
        }
      </EtsBootstrap.Grid.GridBootstrapThead.Thead>
    );
  },
);

export default Thead;
