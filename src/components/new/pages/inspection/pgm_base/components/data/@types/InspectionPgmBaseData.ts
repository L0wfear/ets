import { HandleThunkActionCreator } from 'react-redux';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type InspectionPgmBaseDataStateProps = {
};
export type InspectionPgmBaseDataDispatchProps = {
  actionGetAndSetInStoreInspectPgmBase: HandleThunkActionCreator<typeof inspectionActions.inspectionPgmBaseActions.actionGetAndSetInStoreInspectPgmBase>;
  actionResetInspectPgmBaseList: HandleThunkActionCreator<typeof inspectionActions.inspectionPgmBaseActions.actionResetInspectPgmBaseList>;
};
export type InspectionPgmBaseDataOwnProps = {
  isFirst: boolean;
  pgmBaseId: number;
  loadingPage: string;
};

export type InspectionPgmBaseDataWrapProps = (
  Pick<InspectionPgmBaseDataOwnProps, 'loadingPage'>
) & WithSearchProps;

export type InspectionPgmBaseDataProps = (
  InspectionPgmBaseDataStateProps
  & InspectionPgmBaseDataDispatchProps
  & InspectionPgmBaseDataOwnProps
);
