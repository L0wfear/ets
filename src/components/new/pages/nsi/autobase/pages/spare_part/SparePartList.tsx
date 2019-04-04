import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import SparePartFormLazy from 'components/new/pages/nsi/autobase/pages/spare_part/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/spare_part/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type SparePartListStateProps = {};
export type SparePartListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type SparePartListOwnProps = {};
export type SparePartListMergedProps = (
  SparePartListStateProps
  & SparePartListDispatchProps
  & SparePartListOwnProps
);
export type SparePartListProps = (
  SparePartListMergedProps
);

const SparePartList: React.FC<SparePartListProps> = (props) => {
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
      <SparePartFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<SparePartListProps, SparePartListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<SparePartListStateProps, SparePartListDispatchProps, SparePartListOwnProps, ReduxState>(
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
)(SparePartList);
