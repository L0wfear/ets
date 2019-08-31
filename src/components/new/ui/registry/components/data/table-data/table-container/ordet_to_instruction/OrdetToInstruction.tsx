import * as React from 'react';
import { get } from 'lodash';

import {
  EtsTable,
} from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { EtsThead } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';

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

    return React.useMemo(
      () => (
        <EtsTable fixedWidth={false}>
          <EtsThead>
            <tr className="ets_thead_tr">
              <EtsTheadTh>Дополнительная информация</EtsTheadTh>
            </tr>
          </EtsThead>
          <tbody>
          {
            arrayData && arrayData.length
            ? (
              <EtsTrTbody registryKey={props.registryKey}>
                {
                  arrayData.map((rowData) => (
                    <EtsTbodyTrTd>{rowData.instruction}</EtsTbodyTrTd>
                  ))
                }
              </EtsTrTbody>
            )
            : (
              <EtsTrTbody registryKey={props.registryKey}>
                <EtsTbodyTrTd>Нет данных</EtsTbodyTrTd>
              </EtsTrTbody>
            )
          }
        </tbody>
        </EtsTable>
      ),
      [props.registryKey, arrayData],
    );
  },
);

export default OrdetToInstruction;
