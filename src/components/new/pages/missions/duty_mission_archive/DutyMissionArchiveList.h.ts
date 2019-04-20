import { HandleThunkActionCreator } from "react-redux";
import { registryAddInitialData, registryRemoveData } from "components/new/ui/registry/module/actions-registy";

export type DutyMissionArchiveListStateProps = {};
export type DutyMissionArchiveListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type DutyMissionArchiveListOwnProps = {};
export type DutyMissionArchiveListMergedProps = (
  DutyMissionArchiveListStateProps
  & DutyMissionArchiveListDispatchProps
  & DutyMissionArchiveListOwnProps
);
export type DutyMissionArchiveListProps = (
  DutyMissionArchiveListMergedProps
);
