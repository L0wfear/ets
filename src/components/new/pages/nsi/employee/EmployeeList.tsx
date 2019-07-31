import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import EmployeeFormLazy from 'components/new/pages/nsi/employee/form';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/employee/_config-data/registry-config';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import {
  EmployeeListProps,
  EmployeeListOwnProps,
  EmployeeListDispatchProps,
  EmployeeListStateProps,
} from 'components/new/pages/nsi/employee/EmployeeList.h';

const EmployeeList: React.FC<EmployeeListProps> = (props) => {
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
      <EmployeeFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<EmployeeListProps, EmployeeListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<EmployeeListStateProps, EmployeeListDispatchProps, EmployeeListOwnProps, ReduxState>(
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
)(EmployeeList);
