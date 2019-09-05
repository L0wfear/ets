import * as React from 'react';
import { get } from 'lodash';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = {
  registryKey: string;
};

const OrdetToInstruction: React.FC<Props> = React.memo(
  (props) => {
    const objectExtra = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.objectExtra);
    const array: Array<{ instruction: string }> = get(objectExtra, 'array');

    const arrayData = React.useMemo(
      () => {
        if (array) {
          return array.filter((d) => d.instruction);
        }
        return array;
      },
      [array],
    );

    return (
      <EtsBootstrap.Grid.GridTable fixedWidth={false}>
        <EtsBootstrap.Grid.GridBootstrapThead.Thead>
          <EtsBootstrap.Grid.GridBootstrapThead.Tr className="ets_thead_tr">
            <EtsBootstrap.Grid.GridBootstrapThead.Th>Дополнительная информация</EtsBootstrap.Grid.GridBootstrapThead.Th>
          </EtsBootstrap.Grid.GridBootstrapThead.Tr>
        </EtsBootstrap.Grid.GridBootstrapThead.Thead>
        <EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
          {
            arrayData && arrayData.length
            ? (
              <EtsBootstrap.Grid.GridBootstrapTbody.Tr registryKey={props.registryKey}>
                {
                  arrayData.map((rowData) => (
                    <EtsBootstrap.Grid.GridBootstrapTbody.Td>{rowData.instruction}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
                  ))
                }
              </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
            )
            : (
              <EtsBootstrap.Grid.GridBootstrapTbody.Tr registryKey={props.registryKey}>
                <EtsBootstrap.Grid.GridBootstrapTbody.Td>Нет данных</EtsBootstrap.Grid.GridBootstrapTbody.Td>
              </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
            )
          }
        </EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
      </EtsBootstrap.Grid.GridTable>
    );
  },
);

export default OrdetToInstruction;
