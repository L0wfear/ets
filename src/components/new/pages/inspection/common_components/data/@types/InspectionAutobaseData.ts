import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { TypeOfInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';

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
  type: TypeOfInspect;
  getRegistryFunc: (searchState: object) => TypeConfigData;
  makePayloadToCreateInspect?: (searchState: object) => object;
  LineDataCarsLast?: React.ReactNode;
};

export type InspectionAutobaseDataWrapProps = (
  Pick<InspectionAutobaseDataOwnProps, 'loadingPage'>
) & WithSearchProps;

export type InspectionAutobaseDataProps = (
  InspectionAutobaseDataStateProps
  & InspectionAutobaseDataDispatchProps
  & InspectionAutobaseDataOwnProps
) & WithSearchProps;
