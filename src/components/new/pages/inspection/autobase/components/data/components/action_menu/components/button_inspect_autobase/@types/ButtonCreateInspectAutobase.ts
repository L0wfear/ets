import { HandleThunkActionCreator } from 'react-redux';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type ButtonCreateInspectAutobaseStateProps = {
};
export type ButtonCreateInspectAutobaseDispatchProps = {
  actionCreateInspectAutobase: HandleThunkActionCreator<typeof inspectionActions.actionCreateInspectAutobase>;
};
export type ButtonCreateInspectAutobaseOwnProps = {
  loadingPage: string;
  loadRegistryData: () => Promise<void>;
};

export type ButtonCreateInspectAutobaseProps = (
  (
    ButtonCreateInspectAutobaseStateProps
    & ButtonCreateInspectAutobaseDispatchProps
    & ButtonCreateInspectAutobaseOwnProps
  )
  & WithSearchProps
);
