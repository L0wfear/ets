import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';

export type InspectionAutobaseDataStateProps = {
};
export type InspectionAutobaseDataDispatchProps = {
  registryAddInitialData: any;
  registryLoadDataByKey: any;
  registryRemoveData: any;
};
export type InspectionAutobaseDataOwnProps = {
  loadingPage: string;
  triggerKey: string;
  getRegistryFunc: (value: number) => TypeConfigData<any>;
};

export type InspectionAutobaseDataWrapProps = (
  Pick<InspectionAutobaseDataOwnProps, 'loadingPage'>
) & WithSearchProps;

export type InspectionAutobaseDataProps = (
  InspectionAutobaseDataStateProps
  & InspectionAutobaseDataDispatchProps
  & InspectionAutobaseDataOwnProps
) & WithSearchProps;
