import * as React from 'react';

import Thead from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/Thead';
import Tbody from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/Tbody';
import {
  EtsTableWrap,
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
    const groupColumn = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.groupColumn);

    const isGroupColumn = Object.keys(groupColumn).length ? true : false;
    React.useEffect(
      () => {
        setStickyThead('.ets_table_wrap', true);
        return () => setStickyThead('.ets_table_wrap', false);
      },
      [],
    );

    return (
      <EtsBootstrap.Row margin={10}>
        <EtsBootstrap.Col md={format === 'order_to' ? 8 : 12}>
          <EtsTableWrap className="ets_table_wrap" addToMinusHeight={getAddToMinusHeight(format)} isGroupColumn={ isGroupColumn } id={`${props.registryKey}_column_config_table`}>
            <EtsBootstrap.Grid.GridTable fixedWidth={fixedWidth} id={`${props.registryKey}_table`}>
              <Thead registryKey={registryKey}/>
              <Tbody registryKey={registryKey}/>
            </EtsBootstrap.Grid.GridTable>
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
    );
  },
);

export default TableContainer;
