import * as React from 'react';

import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import Th from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/Th';
import { getRegistryState } from 'redux-main/reducers/selectors';

type Props = {
  registryKey: string;
  indexRow: number;
};

const TrHead: React.FC<Props> = React.memo(
  (props) => {
    const fieldsInDeepArr = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.fieldsInDeepArr);
    const fieldsRow = fieldsInDeepArr[props.indexRow];
    const row_fields_table_width = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).meta.row_fields_table_width);
    const rowFields = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).meta.rowFields);

    return React.useMemo(
      () => (
        <EtsBootstrap.Grid.GridBootstrapThead.Tr table_width={row_fields_table_width} fields={rowFields}>
          {
            fieldsRow.map(
              (metaField) => {
                return (
                  <Th key={metaField.key} metaField={metaField} registryKey={props.registryKey} />
                );
              },
            )
          }
        </EtsBootstrap.Grid.GridBootstrapThead.Tr>
      ),
      [props.registryKey, fieldsRow],
    );
  },
);

export default TrHead;
