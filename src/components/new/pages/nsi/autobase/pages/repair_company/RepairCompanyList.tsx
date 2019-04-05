import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import RepairCompanyFormLazy from 'components/new/pages/nsi/autobase/pages/repair_company/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/repair_company/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type RepairCompanyListStateProps = {};
export type RepairCompanyListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type RepairCompanyListOwnProps = {};
export type RepairCompanyListMergedProps = (
  RepairCompanyListStateProps
  & RepairCompanyListDispatchProps
  & RepairCompanyListOwnProps
);
export type RepairCompanyListProps = (
  RepairCompanyListMergedProps
);

const RepairCompanyList: React.FC<RepairCompanyListProps> = (props) => {
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
      <RepairCompanyFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<RepairCompanyListProps, RepairCompanyListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<RepairCompanyListStateProps, RepairCompanyListDispatchProps, RepairCompanyListOwnProps, ReduxState>(
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
)(RepairCompanyList);
