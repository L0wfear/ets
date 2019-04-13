import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type InspectionCarsConditionDataStateProps = {
};
export type InspectionCarsConditionDataDispatchProps = {
  registryAddInitialData: any;
  registryLoadDataByKey: any;
  registryRemoveData: any;
};
export type InspectionCarsConditionDataOwnProps = {
  loadingPage: string;
};

export type InspectionCarsConditionDataWrapProps = (
  Pick<InspectionCarsConditionDataOwnProps, 'loadingPage'>
) & WithSearchProps;

export type InspectionCarsConditionDataProps = (
  InspectionCarsConditionDataStateProps
  & InspectionCarsConditionDataDispatchProps
  & InspectionCarsConditionDataOwnProps
) & WithSearchProps;
