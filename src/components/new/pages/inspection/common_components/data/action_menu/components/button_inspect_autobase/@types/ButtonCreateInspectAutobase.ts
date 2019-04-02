import { HandleThunkActionCreator } from 'react-redux';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';

export type ButtonCreateInspectAutobaseStateProps = {
};
export type ButtonCreateInspectAutobaseDispatchProps = {
  actionCreateInspectAutobase: HandleThunkActionCreator<typeof inspectionAutobaseActions.actionCreateInspectAutobase>;
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
