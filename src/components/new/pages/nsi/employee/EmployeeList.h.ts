import { HandleThunkActionCreator } from 'react-redux';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

export type EmployeeListStateProps = {};
export type EmployeeListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type EmployeeListOwnProps = {};
export type EmployeeListMergedProps = (
  EmployeeListStateProps
  & EmployeeListDispatchProps
  & EmployeeListOwnProps
);
export type EmployeeListProps = (
  EmployeeListMergedProps
);
