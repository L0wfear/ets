import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { get } from 'lodash';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type ActualTiresOnCarListStateProps = {};
export type ActualTiresOnCarListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type ActualTiresOnCarListOwnProps = {
  selectedCarData?: Car;
};
export type ActualTiresOnCarListMergedProps = (
  ActualTiresOnCarListStateProps
  & ActualTiresOnCarListDispatchProps
  & ActualTiresOnCarListOwnProps
);
export type ActualTiresOnCarListProps = (
  ActualTiresOnCarListMergedProps
);

const ActualTiresOnCarList: React.FC<ActualTiresOnCarListProps> = (props) => {
  const {
    selectedCarData,
  } = props;

  const car_id = get(selectedCarData, 'asuods_id', null);

  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig(car_id));
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
    </>
  );
};

export default compose<ActualTiresOnCarListProps, ActualTiresOnCarListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<ActualTiresOnCarListStateProps, ActualTiresOnCarListDispatchProps, ActualTiresOnCarListOwnProps, ReduxState>(
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
)(ActualTiresOnCarList);
