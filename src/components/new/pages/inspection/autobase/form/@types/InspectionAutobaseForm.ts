import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { HandleThunkActionCreator } from 'react-redux';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';

export type InspectionAutobaseFormStateProps = {
  inspectAutobaseList: IStateInspectAutobase['inspectAutobaseList'];
};
export type InspectionAutobaseFormDispatchProps = {
  actionGetInspectAutobaseById: HandleThunkActionCreator<typeof inspectionActions.actionGetInspectAutobaseById>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
};
export type InspectionAutobaseFormOwnProps = {
  loadingPage: string;
};
export type InspectionAutobaseFormMergeProps = {
};

export type InspectionAutobaseFormProps = (
  InspectionAutobaseFormStateProps
  & InspectionAutobaseFormDispatchProps
  & InspectionAutobaseFormOwnProps
) & WithSearchProps;
