import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import CompanyStructureFormLazy from 'components/new/pages/nsi/company_structure/form';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/company_structure/_config-data/registry-config';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import { HandleThunkActionCreator } from 'react-redux';

export type CompanyStructureListStateProps = {};
export type CompanyStructureListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type CompanyStructureListOwnProps = {};
export type CompanyStructureListMergedProps = (
  CompanyStructureListStateProps
  & CompanyStructureListDispatchProps
  & CompanyStructureListOwnProps
);
export type CompanyStructureListProps = (
  CompanyStructureListMergedProps
);

const CompanyStructureList: React.FC<CompanyStructureListProps> = (props) => {
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
      <CompanyStructureFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<CompanyStructureListProps, CompanyStructureListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<CompanyStructureListStateProps, CompanyStructureListDispatchProps, CompanyStructureListOwnProps, ReduxState>(
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
)(CompanyStructureList);
