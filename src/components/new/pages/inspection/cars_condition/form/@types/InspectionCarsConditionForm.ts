import { HandleThunkActionCreator } from 'react-redux';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';

export type InspectionCarsConditionFormStateProps = {};
export type InspectionCarsConditionFormDispatchProps = {
  actionGetInspectCarsConditionById: HandleThunkActionCreator<typeof inspectionCarsConditionActions.actionGetInspectCarsConditionById>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
export type InspectionCarsConditionFormOwnProps = {
  loadingPage: string;
};
export type InspectionCarsConditionFormMergeProps = {
};

export type InspectionCarsConditionFormProps = (
  InspectionCarsConditionFormStateProps
  & InspectionCarsConditionFormDispatchProps
  & InspectionCarsConditionFormOwnProps
) & WithSearchProps
  & (
    {
      isPermitted: boolean;
    }
);
