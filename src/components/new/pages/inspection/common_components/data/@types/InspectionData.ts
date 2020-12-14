import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TypeOfInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';

export type InspectionDataStateProps = {
};
export type InspectionDataDispatchProps = {
  registryAddInitialData: any;
  registryLoadDataByKey: any;
  registryRemoveData: any;
};
export type InspectionDataOwnProps = {
  loadingPage: string;
  triggerKey: string;
  type: TypeOfInspect;
  getRegistryFunc: (searchState: object) => TypeConfigData<any>;
  makePayloadToCreateInspect?: (searchState: object) => object;
  LineDataCarsLast?: React.ReactNode;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export type InspectionDataWrapProps = (
  Pick<InspectionDataOwnProps, 'loadingPage'>
) & WithSearchProps;

export type InspectionDataProps = (
  InspectionDataStateProps
  & InspectionDataDispatchProps
  & InspectionDataOwnProps
) & WithSearchProps;
