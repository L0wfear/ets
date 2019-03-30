import * as React from 'react';
import { compose } from 'recompose';
import { InspectionAutobaseDataProps, InspectionAutobaseDataStateProps, InspectionAutobaseDataDispatchProps, InspectionAutobaseDataOwnProps } from './@types/InspectionAutobaseData';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { DivNone } from 'global-styled/global-styled';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import InspectionAutobaseDataActionMenu from './components/action_menu/InspectionAutobaseDataActionMenu';
import InspectionAutobaseDataRegistry from './components/registry/InspectionAutobaseDataRegistry';

const InspectionAutobaseData: React.FC<InspectionAutobaseDataProps> = (props) => {
  const {
    carpoolId,
  } = props;

  React.useEffect(
    () => {
      if (carpoolId) {
        props.actionGetAndSetInStoreInspectAutobase(
          { carpoolId },
          { page: props.loadingPage },
        );
      }

      return () => {
        props.actionResetInspectAutobaseList();
      };
    },
    [carpoolId],
  );

  return (
    carpoolId
      ? (
        <>
          <InspectionAutobaseDataActionMenu
            loadingPage={props.loadingPage}
            loadRegistryData={this.loadRegistryData}
          />
          <InspectionAutobaseDataRegistry registryKey={this.props.loadingPage} />
        </>
      )
      : (
        <DivNone />
      )
  );
};

export default compose<InspectionAutobaseDataProps, InspectionAutobaseDataOwnProps>(
  connect<InspectionAutobaseDataStateProps, InspectionAutobaseDataDispatchProps, InspectionAutobaseDataOwnProps, any, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetAndSetInStoreInspectAutobase: (...arg) => (
        dispatch(
          inspectionActions.actionGetAndSetInStoreInspectAutobase(...arg),
        )
      ),
      actionResetInspectAutobaseList: (...arg) => (
        dispatch(
          inspectionActions.actionResetInspectAutobaseList(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
)(InspectionAutobaseData);
