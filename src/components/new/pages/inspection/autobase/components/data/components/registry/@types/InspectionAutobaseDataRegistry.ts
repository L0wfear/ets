import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';

export type InspectionAutobaseDataRegistryStateProps = {
  inspectAutobaseList: IStateInspectAutobase['inspectAutobaseList'];
};
export type InspectionAutobaseDataRegistryDispatchProps = {
  registryAddInitialData: any;
  registryRemoveData: any;
};
export type InspectionAutobaseDataRegistryOwnProps = {
};
export type InspectionAutobaseDataRegistryMergeProps = {};

export type InspectionAutobaseDataRegistryWrapProps = {};

export type InspectionAutobaseDataRegistryProps = (
  InspectionAutobaseDataRegistryStateProps
  & InspectionAutobaseDataRegistryDispatchProps
  & InspectionAutobaseDataRegistryOwnProps
);
