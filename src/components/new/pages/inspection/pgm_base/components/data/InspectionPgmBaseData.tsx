import * as React from 'react';
import { compose } from 'recompose';
import { InspectionPgmBaseDataProps, InspectionPgmBaseDataStateProps, InspectionPgmBaseDataDispatchProps, InspectionPgmBaseDataOwnProps } from './@types/InspectionPgmBaseData';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { DivNone } from 'global-styled/global-styled';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import InspectionPgmBaseDataActionMenu from './components/action_menu/InspectionPgmBaseDataActionMenu';
import InspectionPgmBaseDataRegistry from './components/registry/InspectionPgmBaseDataRegistry';

const InspectionPgmBaseData: React.FC<InspectionPgmBaseDataProps> = (props) => {
  const {
    pgmBaseId,
  } = props;

  React.useEffect(
    () => {
      if (pgmBaseId) {
        props.actionGetAndSetInStoreInspectPgmBase(
          { pgmBaseId },
          { page: props.loadingPage },
        );
      }

      return () => {
        props.actionResetInspectPgmBaseList();
      };
    },
    [pgmBaseId],
  );

  return (
    pgmBaseId
      ? (
        <>
          <InspectionPgmBaseDataActionMenu
            loadingPage={props.loadingPage}
          />
          <InspectionPgmBaseDataRegistry />
        </>
      )
      : (
        <DivNone />
      )
  );
};

export default compose<InspectionPgmBaseDataProps, InspectionPgmBaseDataOwnProps>(
  connect<InspectionPgmBaseDataStateProps, InspectionPgmBaseDataDispatchProps, InspectionPgmBaseDataOwnProps, any, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetAndSetInStoreInspectPgmBase: (...arg) => (
        dispatch(
          inspectionActions.actionGetAndSetInStoreInspectPgmBase(...arg),
        )
      ),
      actionResetInspectPgmBaseList: (...arg) => (
        dispatch(
          inspectionActions.actionResetInspectPgmBaseList(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
)(InspectionPgmBaseData);
