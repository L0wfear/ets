import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import CarActualFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { HandleThunkActionCreator } from 'react-redux';

export type CarActualListStateProps = {};
export type CarActualListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type CarActualListOwnProps = {};
export type CarActualListMergedProps = (
  CarActualListStateProps
  & CarActualListDispatchProps
  & CarActualListOwnProps
);
export type CarActualListProps = (
  CarActualListMergedProps
);

const CarActualList: React.FC<CarActualListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(config);

      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
      <>
      <Registry registryKey={registryKey} />
      <CarActualFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<CarActualListProps, CarActualListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<CarActualListStateProps, CarActualListDispatchProps, CarActualListOwnProps, ReduxState>(
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
)(CarActualList);
