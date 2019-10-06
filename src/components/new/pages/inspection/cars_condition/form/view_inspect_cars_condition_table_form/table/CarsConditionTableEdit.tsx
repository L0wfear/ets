import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getConfig,
} from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/table/_config-data/registry-config';

import { registryAddInitialData, registryRemoveData, registryChangeObjectExtra, } from 'components/new/ui/registry/module/actions-registy';

import { etsUseDispatch, } from 'components/@next/ets_hoc/etsUseDispatch';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { actionInspectionConfigGetAndSetInStore, } from 'redux-main/reducers/modules/some_uniq/inspection_config/actions';
import { actionGetInspectCarsConditionById } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';

type OwnProps = {
  // carsConditionCarsList: CarsConditionCars[];
};

type Props = (
  OwnProps
  & WithSearchProps
);

const CarsConditionTableEdit: React.FC<Props> = (props) => {
  const dispatch = etsUseDispatch();
  const inspectId = getNumberValueFromSerch(props.searchState.inspectId);

  React.useEffect(
    () => {
      if (inspectId) {
        const loadData = async () => {
          await dispatch(
            registryAddInitialData(getConfig(inspectId)),
          );
          const inspect_data = await dispatch(actionGetInspectCarsConditionById(inspectId, { page: registryKey }));
          dispatch(
            registryChangeObjectExtra(registryKey, { inspect_data }),
          );
        };
        loadData();
      }

      return () => {
        dispatch(
          registryRemoveData(registryKey),
        );
      };
    },
    [inspectId, getConfig],
  );

  React.useEffect(() => {
    dispatch(actionInspectionConfigGetAndSetInStore({ page: '', path: '' }));
  }, []);

  return (
    <Registry registryKey={registryKey} />
  );
};

export default withSearch<OwnProps>(CarsConditionTableEdit);
