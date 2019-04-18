import * as React from 'react';
import { DivNone } from 'global-styled/global-styled';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import CarActualFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form';
import carActualPermissions from '../../autobase/pages/car_actual/_config-data/permissions';
import ChangeRouteFormLazy from 'components/new/pages/nsi/technical_operation_relations/form/change_route';
import routePermissions from 'components/new/pages/routes_list/config-data/permissions';

type TechnicalOperationRelationsFormLazyProps = {
  registryKey: string;
} & WithSearchProps;

const TechnicalOperationRelationsFormLazy: React.FC<TechnicalOperationRelationsFormLazyProps> = (
  (props) => {
    const technical_operation_relations_type_form = props.match.params.technical_operation_relations_type_form;
    const car_actual_asuods_id = getNumberValueFromSerch(props.match.params.car_actual_asuods_id);

    React.useEffect(
      () => {
        if ((technical_operation_relations_type_form === 'change_driver' || technical_operation_relations_type_form === 'change_route') && !car_actual_asuods_id) {
          props.setParams({
            technical_operation_relations_type_form: null,
          });
        }
      },
      [technical_operation_relations_type_form, car_actual_asuods_id, props.setParams, props.match.params],
    );

    if (technical_operation_relations_type_form === 'change_driver' && car_actual_asuods_id) {
      return (
        <CarActualFormLazy
          registryKey={props.registryKey}
          uniqKeyForParams="car_actual_asuods_id"
          permissions={carActualPermissions}
        />
      );
    }

    if (technical_operation_relations_type_form === 'change_route' && car_actual_asuods_id) {
      return (
        <ChangeRouteFormLazy
          registryKey={props.registryKey}
          uniqKeyForParams="car_actual_asuods_id"
          permissions={routePermissions}
        />
      );
    }

    return (
      <DivNone />
    );
  }
);

export default withSearch(TechnicalOperationRelationsFormLazy);
