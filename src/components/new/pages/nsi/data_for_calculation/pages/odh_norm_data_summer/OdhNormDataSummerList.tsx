import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import OdhNormDataSummerFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/odh_norm_data_summer/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/odh_norm_data_summer/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type OdhNormDataSummerListStateProps = {};
export type OdhNormDataSummerListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type OdhNormDataSummerListOwnProps = {};
export type OdhNormDataSummerListMergedProps = (
  OdhNormDataSummerListStateProps
  & OdhNormDataSummerListDispatchProps
  & OdhNormDataSummerListOwnProps
);
export type OdhNormDataSummerListProps = (
  OdhNormDataSummerListMergedProps
);

const OdhNormDataSummerList: React.FC<OdhNormDataSummerListProps> = (props) => {
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
      <OdhNormDataSummerFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<OdhNormDataSummerListProps, OdhNormDataSummerListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<OdhNormDataSummerListStateProps, OdhNormDataSummerListDispatchProps, OdhNormDataSummerListOwnProps, ReduxState>(
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
)(OdhNormDataSummerList);
