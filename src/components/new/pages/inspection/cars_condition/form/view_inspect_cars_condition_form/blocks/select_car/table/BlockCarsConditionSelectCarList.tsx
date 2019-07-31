import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getConfig,
} from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/select_car/table/_config-data/registry-config';

import { compose } from 'recompose';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type BlockCarsConditionSelectCarListProps = {
  carsConditionCarsList: CarsConditionCars[];
};

const BlockCarsConditionSelectCarList: React.FC<BlockCarsConditionSelectCarListProps> = (props) => {
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        registryAddInitialData(getConfig(props.carsConditionCarsList)),
      );

      return () => {
        dispatch(
          registryRemoveData(registryKey),
        );
      };
    },
    [props.carsConditionCarsList],
  );

  return (
      <>
        <Registry registryKey={registryKey} />
      </>
  );
};

export default compose<BlockCarsConditionSelectCarListProps, BlockCarsConditionSelectCarListProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
)(BlockCarsConditionSelectCarList);
