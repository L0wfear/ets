import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type InspectionAutobaseDataRegistryStateProps = {
  inspectAutobaseList: IStateInspectAutobase['inspectAutobaseList'];
};
export type InspectionAutobaseDataRegistryDispatchProps = {
  registryAddInitialData: any;
  registryLoadDataByKey: any;
  registryRemoveData: any;
};
export type InspectionAutobaseDataRegistryOwnProps = {
  registryKey: string;
};
export type InspectionAutobaseDataRegistryMergeProps = {};

export type InspectionAutobaseDataRegistryWrapProps = {};

export type InspectionAutobaseDataRegistryProps = (
  InspectionAutobaseDataRegistryStateProps
  & InspectionAutobaseDataRegistryDispatchProps
  & InspectionAutobaseDataRegistryOwnProps
) & WithSearchProps;
