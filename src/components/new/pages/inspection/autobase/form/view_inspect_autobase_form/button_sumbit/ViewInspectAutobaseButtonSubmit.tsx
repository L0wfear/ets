import * as React from 'react';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import ViewInspectButtonSubmit from './ViewInspectButtonSubmit';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { compose } from 'recompose';
import { saveData } from 'utils/functions';
import { get } from 'lodash';

type ViewInspectAutobaseButtonSubmitDispatchProps = {
  actionUpdateInspectAutobase: HandleThunkActionCreator<typeof inspectionActions.actionUpdateInspectAutobase>;
  actionCloseInspectAutobase: HandleThunkActionCreator<typeof inspectionActions.actionCloseInspectAutobase>;
  actionGetBlobActInspect: HandleThunkActionCreator<typeof inspectionActions.actionGetBlobActInspect>;
};

type ViewInspectAutobaseButtonSubmitOwnProps = {
  type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM;
  handleHide: (isSubmitted: boolean) => any;
  selectedInspectAutobase: InspectAutobase;
  canSave: boolean;
  loadingPage: string;
};

type ViewInspectAutobaseButtonSubmitProps = (
  ViewInspectAutobaseButtonSubmitDispatchProps
  & ViewInspectAutobaseButtonSubmitOwnProps
);

export const ViewInspectAutobaseButtonSubmit: React.FC<ViewInspectAutobaseButtonSubmitProps> = (props) => {
  const { selectedInspectAutobase, canSave } = props;

  const handleSubmit = React.useCallback(
    async () => {
      if (canSave) {
        await props.actionUpdateInspectAutobase(
          selectedInspectAutobase,
          { page: props.loadingPage },
        );

        props.handleHide(true);
      }
    },
    [selectedInspectAutobase, canSave],
  );

  const handleGetAutobaseAct = React.useCallback(
    async () => {
      if (canSave) {
        const response = await props.actionGetBlobActInspect(
          selectedInspectAutobase.id,
          { page: props.loadingPage },
        );

        const blob = get(response, 'blob', null);
        const fileName = get(response, 'fileName', '');
        if (blob) {
          saveData(blob, fileName);
        }
      }
    },
    [selectedInspectAutobase, canSave],
  );

  const handleCloseAndAutobaseAct = React.useCallback(
    async () => {
      if (canSave) {
        await props.actionCloseInspectAutobase(
          selectedInspectAutobase,
          { page: props.loadingPage },
        );
        await handleGetAutobaseAct();
        props.handleHide(true);
      }
    },
    [selectedInspectAutobase, canSave],
  );

  return (
    <ViewInspectButtonSubmit
      handleSubmit={handleSubmit}
      handleCloseAndAutobaseAct={handleCloseAndAutobaseAct}
      handleGetAutobaseAct={handleGetAutobaseAct}
      type={props.type}
      canSave={props.canSave}
    />
  );
};

export default compose<ViewInspectAutobaseButtonSubmitProps, ViewInspectAutobaseButtonSubmitOwnProps>(
  connect<{}, ViewInspectAutobaseButtonSubmitDispatchProps, ViewInspectAutobaseButtonSubmitOwnProps, {}, ReduxState>(
    null,
    (dispatch: any) => ({
      actionUpdateInspectAutobase: (...arg) => (
        dispatch(
          inspectionActions.actionUpdateInspectAutobase(...arg),
        )
      ),
      actionCloseInspectAutobase: (...arg) => (
        dispatch(
          inspectionActions.actionCloseInspectAutobase(...arg),
        )
      ),
      actionGetBlobActInspect: (...arg) => (
        dispatch(
          inspectionActions.actionGetBlobActInspect(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
)(ViewInspectAutobaseButtonSubmit);
