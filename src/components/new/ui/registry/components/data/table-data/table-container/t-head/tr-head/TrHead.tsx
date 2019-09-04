import * as React from 'react';

import TrTh from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/TrTh';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

type Props = {
  registryKey: string;
  indexRow: number;
};

const TrHead: React.FC<Props> = React.memo(
  (props) => {
    const thDataRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.fieldsInDeepArr[props.indexRow]);

    return (
      <tr className="ets_thead_tr">
        {
          thDataRow.map(
            (colData) => {
              return (
                <TrTh key={colData.key} colData={colData} registryKey={props.registryKey} />
              );
            },
          )
        }
      </tr>
    );
  },
);

export default TrHead;
