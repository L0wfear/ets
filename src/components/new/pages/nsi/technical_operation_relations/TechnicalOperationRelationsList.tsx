import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import TechnicalOperationRelationsFormLazy from 'components/new/pages/nsi/technical_operation_relations/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/technical_operation_relations/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};

type Props = (
  OwnProps
) & WithSearchProps;

const TechnicalOperationRelationsList: React.FC<Props> = (props) => {
  const technical_operation_id = getNumberValueFromSerch(props.searchState.technical_operation_id) || null;
  const municipal_facility_id = getNumberValueFromSerch(props.searchState.municipal_facility_id) || null;
  const route_types = props.searchState.route_types || null;
  const func_type_id = getNumberValueFromSerch(props.searchState.func_type_id) || null;
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        registryAddInitialData(
          getToConfig(
            technical_operation_id,
            municipal_facility_id,
            route_types,
            func_type_id,
          ),
        ),
      );
      return () => {
        dispatch(registryRemoveData(registryKey));
      };
    },
    [],
  );

  React.useEffect(
    () => {
      if (technical_operation_id && municipal_facility_id && route_types && func_type_id) {
        const payload = {
          getRegistryData: {
            technical_operation_id,
            municipal_facility_id,
            route_types,
            func_type_id,
          },
        };

        dispatch(actionChangeGlobalPaylaodInServiceData(registryKey, payload));
      }
    },
    [technical_operation_id, municipal_facility_id, route_types, func_type_id],
  );

  return (
    <Registry registryKey={registryKey}>
      <TechnicalOperationRelationsFormLazy registryKey={registryKey} />
    </Registry>
  );
};

export default withSearch<OwnProps>(TechnicalOperationRelationsList);
