import * as React from 'react';

import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import Th from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/Th';

type Props = {
  registryKey: string;
  indexRow: number;
  tableScrollXPos: number;
};

const TrHead: React.FC<Props> = React.memo(
  (props) => {
    const fieldsInDeepArr = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.fieldsInDeepArr);
    const fieldsRow = fieldsInDeepArr[props.indexRow];

    return (
      <EtsBootstrap.Grid.GridBootstrapThead.Tr className="ets_thead_tr">
        {
          fieldsRow.map(
            (metaField) => {
              return (
                <Th key={metaField.key} metaField={metaField} registryKey={props.registryKey} tableScrollXPos={props.tableScrollXPos} />
              );
            },
          )
        }
      </EtsBootstrap.Grid.GridBootstrapThead.Tr>
    );
  },
);

export default TrHead;
