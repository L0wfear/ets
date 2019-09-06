import * as React from 'react';

import { selectorShowArray, getListData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import Tr from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/Tr';

type Props = {
  registryKey: string;
};

const Tbody: React.FC<Props> = React.memo(
  (props) => {
    const showArray = etsUseSelector((state) => selectorShowArray(state, props.registryKey));
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
        {
          showArray.map((rowData, indexRow) => (
            <Tr key={rowData[uniqKey]} rowData={rowData} indexRow={indexRow} registryKey={props.registryKey}/>
          ))
        }
      </EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
    );
  },
);

export default Tbody;
