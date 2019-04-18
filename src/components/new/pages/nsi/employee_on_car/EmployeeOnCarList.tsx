import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import CarActualFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/employee_on_car/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

export type EmployeeOnCarListStateProps = {};
export type EmployeeOnCarListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type EmployeeOnCarListOwnProps = {};
export type EmployeeOnCarListMergedProps = (
  EmployeeOnCarListStateProps
  & EmployeeOnCarListDispatchProps
  & EmployeeOnCarListOwnProps
);
export type EmployeeOnCarListProps = (
  EmployeeOnCarListMergedProps
);

const EmployeeOnCarList: React.FC<EmployeeOnCarListProps> = (props) => {
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
      <CarActualFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<EmployeeOnCarListProps, EmployeeOnCarListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<EmployeeOnCarListStateProps, EmployeeOnCarListDispatchProps, EmployeeOnCarListOwnProps, ReduxState>(
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
  withSearch,
)(EmployeeOnCarList);
