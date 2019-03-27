import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type InspectionPgmBaseDataRegistryStateProps = {
  inspectPgmBaseList: IStateInspectPgmBase['inspectPgmBaseList'];
};
export type InspectionPgmBaseDataRegistryDispatchProps = {
  registryAddInitialData: any;
  registryLoadDataByKey: any;
  registryRemoveData: any;
};
export type InspectionPgmBaseDataRegistryOwnProps = {
};
export type InspectionPgmBaseDataRegistryMergeProps = {};

export type InspectionPgmBaseDataRegistryWrapProps = {};

export type InspectionPgmBaseDataRegistryProps = (
  InspectionPgmBaseDataRegistryStateProps
  & InspectionPgmBaseDataRegistryDispatchProps
  & InspectionPgmBaseDataRegistryOwnProps
) & WithSearchProps;
