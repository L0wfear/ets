import * as React from 'react';

import Thead from 'components/new/ui/registry/components/data/table-data/table-container/t-head/Thead';
import Tbody from 'components/new/ui/registry/components/data/table-data/table-container/t-body/Tbody';
import {
  EtsTableWrap,
  EtsTable,
} from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { setStickyThead } from 'utils/stickyTableHeader';
import { getListData, getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import EtsTableSearchParams from 'components/new/ui/registry/components/data/table-data/table-container/search_params/EtsTableSearchParams';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import OrdetToInstruction from 'components/new/ui/registry/components/data/table-data/table-container/ordet_to_instruction/OrdetToInstruction';

type Props = {
  registryKey: string;
};

const getAddToMinusHeight = (format: OneRegistryData['header']['format']) => {
  switch (format) {
    case 'select_for_technical_operation_relations': return 100;
    default: return 0;
  }
};

const TableContainer: React.FC<Props> = React.memo(
  (props) => {
    const { registryKey } = props;
    const fixedWidth = etsUseSelector((state) => getListData(state.registry, registryKey).data.fixedWidth);
    const format = etsUseSelector((state) => getHeaderData(getRegistryState(state), registryKey).format);

    React.useEffect(
      () => {
        setStickyThead('.ets_table_wrap', true);
        return () => setStickyThead('.ets_table_wrap', false);
      },
      [],
    );

    return React.useMemo(
      () => (
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={format === 'order_to' ? 8 : 12}>
              <EtsTableWrap className="ets_table_wrap" addToMinusHeight={getAddToMinusHeight(format)}>
                <EtsTable fixedWidth={fixedWidth}>
                  <Thead registryKey={registryKey} />
                  <Tbody registryKey={registryKey} />
                </EtsTable>
                <EtsTableSearchParams registryKey={registryKey} />
              </EtsTableWrap>
            </EtsBootstrap.Col>
            {
              format === 'order_to' && (
                <EtsBootstrap.Col md={4}>
                  <OrdetToInstruction registryKey={registryKey} />
                </EtsBootstrap.Col>
              )
            }
          </EtsBootstrap.Row>
      ),
      [registryKey, fixedWidth, format],
    );
  },
);

export default TableContainer;
