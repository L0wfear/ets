import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getConfig,
} from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/select_car/table/_config-data/registry-config';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import { HandleThunkActionCreator } from "react-redux";
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export type BlockCarsConditionSelectCarListStateProps = {};
export type BlockCarsConditionSelectCarListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type BlockCarsConditionSelectCarListOwnProps = {
  carsConditionCarsList: CarsConditionCars[];
};
export type BlockCarsConditionSelectCarListMergedProps = (
  BlockCarsConditionSelectCarListStateProps
  & BlockCarsConditionSelectCarListDispatchProps
  & BlockCarsConditionSelectCarListOwnProps
);
export type BlockCarsConditionSelectCarListProps = (
  BlockCarsConditionSelectCarListMergedProps
);

const BlockCarsConditionSelectCarList: React.FC<BlockCarsConditionSelectCarListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(getConfig(props.carsConditionCarsList));

      return () => {
        props.registryRemoveData(registryKey);
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

export default compose<BlockCarsConditionSelectCarListProps, BlockCarsConditionSelectCarListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<BlockCarsConditionSelectCarListStateProps, BlockCarsConditionSelectCarListDispatchProps, BlockCarsConditionSelectCarListOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      registryAddInitialData: (...any) => (
        dispatch(
          registryAddInitialData(...any),
        )
      ),
      registryRemoveData: (registryKeyTemp: string) => (
        dispatch(
          registryRemoveData(registryKeyTemp),
        )
      ),
    }),
  ),
)(BlockCarsConditionSelectCarList);
