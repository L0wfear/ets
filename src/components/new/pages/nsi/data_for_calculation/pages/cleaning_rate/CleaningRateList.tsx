import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import CleaningRateFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

export type CleaningRateListStateProps = {};
export type CleaningRateListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type CleaningRateListOwnProps = {};
export type CleaningRateListMergedProps = (
  CleaningRateListStateProps
  & CleaningRateListDispatchProps
  & CleaningRateListOwnProps
);
export type CleaningRateListProps = (
  CleaningRateListMergedProps
);

const CleaningRateList: React.FC<CleaningRateListProps> = (props) => {
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
      <CleaningRateFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<CleaningRateListProps, CleaningRateListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<CleaningRateListStateProps, CleaningRateListDispatchProps, CleaningRateListOwnProps, ReduxState>(
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
)(CleaningRateList);
