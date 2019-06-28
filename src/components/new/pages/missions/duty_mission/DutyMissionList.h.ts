import { HandleThunkActionCreator } from "react-redux";
import { registryAddInitialData, registryRemoveData, actionUnselectSelectedRowToShow } from "components/new/ui/registry/module/actions-registy";

export type DutyMissionListStateProps = {};
export type DutyMissionListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
};
export type DutyMissionListOwnProps = {};
export type DutyMissionListMergedProps = (
  DutyMissionListStateProps
  & DutyMissionListDispatchProps
  & DutyMissionListOwnProps
);
export type DutyMissionListProps = (
  DutyMissionListMergedProps
);
