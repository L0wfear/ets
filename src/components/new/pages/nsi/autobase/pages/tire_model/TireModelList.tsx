import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import TireModelFormLazy from 'components/new/pages/nsi/autobase/pages/tire_model/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tire_model/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type TireModelListStateProps = {};
export type TireModelListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type TireModelListOwnProps = {};
export type TireModelListMergedProps = (
  TireModelListStateProps
  & TireModelListDispatchProps
  & TireModelListOwnProps
);
export type TireModelListProps = (
  TireModelListMergedProps
);

const TireModelList: React.FC<TireModelListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig());
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <TireModelFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<TireModelListProps, TireModelListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<TireModelListStateProps, TireModelListDispatchProps, TireModelListOwnProps, ReduxState>(
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
)(TireModelList);
