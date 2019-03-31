import { HandleThunkActionCreator } from 'react-redux';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type ButtonCreateInspectPgmBaseStateProps = {
};
export type ButtonCreateInspectPgmBaseDispatchProps = {
  actionCreateInspectPgmBase: HandleThunkActionCreator<typeof inspectionActions.inspectionPgmBaseActions.actionCreateInspectPgmBase>;
};
export type ButtonCreateInspectPgmBaseOwnProps = {
  loadingPage: string;
};

export type ButtonCreateInspectPgmBaseProps = (
  (
    ButtonCreateInspectPgmBaseStateProps
    & ButtonCreateInspectPgmBaseDispatchProps
    & ButtonCreateInspectPgmBaseOwnProps
  )
  & WithSearchProps
);
