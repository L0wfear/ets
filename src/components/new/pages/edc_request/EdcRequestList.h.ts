import { HandleThunkActionCreator } from "react-redux";
import { registryAddInitialData, registryRemoveData } from "components/new/ui/registry/module/actions-registy";

export type EdcRequestListStateProps = {};
export type EdcRequestListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type EdcRequestListOwnProps = {};
export type EdcRequestListMergedProps = (
  EdcRequestListStateProps
  & EdcRequestListDispatchProps
  & EdcRequestListOwnProps
);
export type EdcRequestListProps = (
  EdcRequestListMergedProps
);
