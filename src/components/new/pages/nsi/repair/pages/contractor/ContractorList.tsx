import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import ContractorFormLazy from 'components/new/pages/nsi/repair/pages/contractor/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/repair/pages/contractor/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

export type ContractorListStateProps = {};
export type ContractorListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type ContractorListOwnProps = {};
export type ContractorListMergedProps = (
  ContractorListStateProps
  & ContractorListDispatchProps
  & ContractorListOwnProps
);
export type ContractorListProps = (
  ContractorListMergedProps
);

const ContractorList: React.FC<ContractorListProps> = (props) => {
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
      <ContractorFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<ContractorListProps, ContractorListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<ContractorListStateProps, ContractorListDispatchProps, ContractorListOwnProps, ReduxState>(
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
)(ContractorList);
