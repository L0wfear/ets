import { HandleThunkActionCreator } from 'react-redux';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type InspectionAutobaseDataStateProps = {
};
export type InspectionAutobaseDataDispatchProps = {
  actionGetAndSetInStoreInspectAutobase: HandleThunkActionCreator<typeof inspectionActions.actionGetAndSetInStoreInspectAutobase>;
  actionResetInspectAutobaseList: HandleThunkActionCreator<typeof inspectionActions.actionResetInspectAutobaseList>;
};
export type InspectionAutobaseDataOwnProps = {
  isFirst: boolean;
  carpoolId: number;
  loadingPage: string;
};

export type InspectionAutobaseDataWrapProps = (
  Pick<InspectionAutobaseDataOwnProps, 'loadingPage'>
) & WithSearchProps;

export type InspectionAutobaseDataProps = (
  InspectionAutobaseDataStateProps
  & InspectionAutobaseDataDispatchProps
  & InspectionAutobaseDataOwnProps
);
