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
    const uniqKeyForSelect = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForSelect);
    const key = uniqKeyForSelect || uniqKey;
    const rowFieldsLength = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.rowFields.length);

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
        {
          showArray.map((rowData, indexRow) => (
            <Tr key={rowData[key]} rowData={rowData} indexRow={indexRow} registryKey={props.registryKey}/>
          ))
        }
        {
          !Boolean(showArray[0]) && (
            <EtsBootstrap.Grid.GridBootstrapTbody.Tr registryKey={props.registryKey}>
              <EtsBootstrap.Grid.GridBootstrapTbody.Td colSpan={rowFieldsLength}>Нет данных</EtsBootstrap.Grid.GridBootstrapTbody.Td>
            </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
          )
        }
      </EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
    );
  },
);

export default Tbody;
