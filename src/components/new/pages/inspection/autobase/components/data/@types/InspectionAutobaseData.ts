import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type InspectionAutobaseDataStateProps = {
};
export type InspectionAutobaseDataDispatchProps = {
  registryAddInitialData: any;
  registryLoadDataByKey: any;
  registryRemoveData: any;
};
export type InspectionAutobaseDataOwnProps = {
  loadingPage: string;
};

export type InspectionAutobaseDataWrapProps = (
  Pick<InspectionAutobaseDataOwnProps, 'loadingPage'>
) & WithSearchProps;

export type InspectionAutobaseDataProps = (
  InspectionAutobaseDataStateProps
  & InspectionAutobaseDataDispatchProps
  & InspectionAutobaseDataOwnProps
) & WithSearchProps;
