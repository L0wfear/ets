import { HandleThunkActionCreator } from "react-redux";
import { registryAddInitialData, registryRemoveData } from "components/new/ui/registry/module/actions-registy";

export type DutyMissionTemplateListStateProps = {};
export type DutyMissionTemplateListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type DutyMissionTemplateListOwnProps = {};
export type DutyMissionTemplateListMergedProps = (
  DutyMissionTemplateListStateProps
  & DutyMissionTemplateListDispatchProps
  & DutyMissionTemplateListOwnProps
);
export type DutyMissionTemplateListProps = (
  DutyMissionTemplateListMergedProps
);
