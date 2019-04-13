import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { HandleThunkActionCreator } from 'react-redux';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';

export type InspectionAutobaseFormStateProps = {
  inspectAutobaseList: IStateInspectAutobase['inspectAutobaseList'];
};
export type InspectionAutobaseFormDispatchProps = {
  actionGetInspectAutobaseById: HandleThunkActionCreator<typeof inspectionAutobaseActions.actionGetInspectAutobaseById>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
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
