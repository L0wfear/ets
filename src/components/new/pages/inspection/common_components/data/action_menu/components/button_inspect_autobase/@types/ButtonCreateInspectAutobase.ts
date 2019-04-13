import { HandleThunkActionCreator } from 'react-redux';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { TypeOfInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';

export type ButtonCreateInspectAutobaseStateProps = {
  permissions: string | boolean;
};
export type ButtonCreateInspectAutobaseDispatchProps = {
  actionCreateInspect: HandleThunkActionCreator<typeof inspectionActions.actionCreateInspect>;
};
export type ButtonCreateInspectAutobaseOwnProps = {
  loadingPage: string;
  loadRegistryData: () => Promise<void>;
  type: TypeOfInspect;
  triggerKey: string;
  makePayloadToCreateInspect?: (searchState: object) => object;
};

export type ButtonCreateInspectAutobaseProps = (
  (
    ButtonCreateInspectAutobaseStateProps
    & ButtonCreateInspectAutobaseDispatchProps
    & ButtonCreateInspectAutobaseOwnProps
  )
  & WithSearchProps
);
