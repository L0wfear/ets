import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { HandleThunkActionCreator } from 'react-redux';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';

export type InspectionPgmBaseFormStateProps = {
  inspectPgmBaseList: IStateInspectPgmBase['inspectPgmBaseList'];
  pgmBaseList: IStateInspectPgmBase['pgmBaseList'];
};
export type InspectionPgmBaseFormDispatchProps = {
  actionGetInspectPgmBaseById: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionGetInspectPgmBaseById>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionSetInspectPgmBaseInspectPgmBaseList: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionSetInspectPgmBaseInspectPgmBaseList>;
};
export type InspectionPgmBaseFormOwnProps = {
  loadingPage: string;
};
export type InspectionPgmBaseFormMergeProps = {
};

export type InspectionPgmBaseFormProps = (
  InspectionPgmBaseFormStateProps
  & InspectionPgmBaseFormDispatchProps
  & InspectionPgmBaseFormOwnProps
) & WithSearchProps;
