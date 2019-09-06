import * as React from 'react';

import FiltersWrap from 'components/new/ui/registry/components/data/filters/FiltersWrap';
import Paginator from 'components/new/ui/registry/components/data/paginator/Paginator';
import TableData from 'components/new/ui/registry/components/data/table-data/TableData';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DivNone } from 'global-styled/global-styled';

type OwnProps = {
  registryKey: string;
};
type Props = (
  OwnProps
  & WithSearchProps
);

const SelectForTechnicalOperationRelationsRegistryWrap: React.FC<Props> = React.memo(
  (props) => {
    const {
      registryKey,
    } = props;

    const technical_operation_id = props.searchState.technical_operation_id || null;
    const municipal_facility_id = props.searchState.municipal_facility_id || null;
    const route_types = props.searchState.route_types || null;
    const func_type_id = props.searchState.func_type_id || null;

    const hasAllData = (
      technical_operation_id
      && municipal_facility_id
      && route_types
      && func_type_id
    );

    return (
      hasAllData
        ? (
          <>
            <FiltersWrap registryKey={registryKey} />
            <TableData registryKey={registryKey} />
            <Paginator registryKey={registryKey} />
          </>
        )
        : (
          <DivNone />
        )
    );
  },
);

export default withSearch<OwnProps>(SelectForTechnicalOperationRelationsRegistryWrap);
