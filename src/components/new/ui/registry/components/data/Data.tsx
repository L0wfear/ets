import * as React from 'react';

import Header from 'components/new/ui/registry/components/data/header/Header';
import FiltersWrap from 'components/new/ui/registry/components/data/filters/FiltersWrap';
import TableData from 'components/new/ui/registry/components/data/table-data/TableData';
import Paginator from 'components/new/ui/registry/components/data/paginator/Paginator';

import { EtsDataContainer } from 'components/new/ui/registry/components/data/styled/styled';

import { getHeaderData } from '../../module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import SelectForTechnicalOperationRelationsRegistryWrap from './SelectForTechnicalOperationRelationsRegistryWrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  registryKey: string;
};

const Data: React.FC<Props> = React.memo(
  (props) => {
    const {
      registryKey,
    } = props;
    const format = etsUseSelector((state) => getHeaderData(getRegistryState(state), registryKey).format);

    return (
      <EtsDataContainer>
        {
          format === 'select_for_technical_operation_relations'
            ? (
              <React.Fragment>
                <Header registryKey={registryKey} />
                <SelectForTechnicalOperationRelationsRegistryWrap registryKey={registryKey} />
              </React.Fragment>
            )
            : (
              <React.Fragment>
                <Header registryKey={registryKey} />
                <FiltersWrap registryKey={registryKey} />
                <TableData registryKey={registryKey} />
                <Paginator registryKey={registryKey} />
              </React.Fragment>
            )
        }
      </EtsDataContainer>
    );
  },
);

export default Data;
