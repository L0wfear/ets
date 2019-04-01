import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type InspectionPgmBaseDataStateProps = {
};
export type InspectionPgmBaseDataDispatchProps = {
  registryAddInitialData: any;
  registryLoadDataByKey: any;
  registryRemoveData: any;
};
export type InspectionPgmBaseDataOwnProps = {
  loadingPage: string;
};

export type InspectionPgmBaseDataWrapProps = (
  Pick<InspectionPgmBaseDataOwnProps, 'loadingPage'>
) & WithSearchProps;

export type InspectionPgmBaseDataProps = (
  InspectionPgmBaseDataStateProps
  & InspectionPgmBaseDataDispatchProps
  & InspectionPgmBaseDataOwnProps
) & WithSearchProps;
