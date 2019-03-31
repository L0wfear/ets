import * as React from 'react';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import ViewInspectButtonSubmit from './ViewInspectButtonSubmit';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { compose } from 'recompose';
import { saveData } from 'utils/functions';
import { get } from 'lodash';

type ViewInspectPgmBaseButtonSubmitDispatchProps = {
  actionUpdateInspectPgmBase: HandleThunkActionCreator<typeof inspectionActions.actionUpdateInspectPgmBase>;
  actionCloseInspectPgmBase: HandleThunkActionCreator<typeof inspectionActions.actionCloseInspectPgmBase>;
  actionGetBlobActInspect: HandleThunkActionCreator<typeof inspectionActions.actionGetBlobActInspect>;
};

type ViewInspectPgmBaseButtonSubmitOwnProps = {
  type: keyof typeof INSPECT_PGM_BASE_TYPE_FORM;
  handleHide: (isSubmitted: boolean) => any;
  selectedInspectPgmBase: InspectPgmBase;
  canSave: boolean;
  loadingPage: string;
};

type ViewInspectPgmBaseButtonSubmitProps = (
  ViewInspectPgmBaseButtonSubmitDispatchProps
  & ViewInspectPgmBaseButtonSubmitOwnProps
);

export const ViewInspectPgmBaseButtonSubmit: React.FC<ViewInspectPgmBaseButtonSubmitProps> = (props) => {
  const { selectedInspectPgmBase, canSave } = props;

  const handleSubmit = React.useCallback(
    async () => {
      if (canSave) {
        await props.actionUpdateInspectPgmBase(
          selectedInspectPgmBase,
          { page: props.loadingPage },
        );

        props.handleHide(true);
      }
    },
    [selectedInspectPgmBase, canSave],
  );

  const handleGetPgmBaseAct = React.useCallback(
    async () => {
      if (canSave) {
        const response = await props.actionGetBlobActInspect(
          selectedInspectPgmBase.id,
          { page: props.loadingPage },
        );

        const blob = get(response, 'blob', null);
        const fileName = get(response, 'fileName', '');
        if (blob) {
          saveData(blob, fileName);
        }
      }
    },
    [selectedInspectPgmBase, canSave],
  );

  const handleCloseAndPgmBaseAct = React.useCallback( // хендлер на закрытие акта
    async () => {
      if (canSave) {
        await props.actionCloseInspectPgmBase(
          selectedInspectPgmBase,
          { page: props.loadingPage },
        );
        await handleGetPgmBaseAct();
        props.handleHide(true);
      }
    },
    [selectedInspectPgmBase, canSave],
  );

  return (
    <ViewInspectButtonSubmit
      handleSubmit={handleSubmit}
      handleCloseAndPgmBaseAct={handleCloseAndPgmBaseAct}
      handleGetPgmBaseAct={handleGetPgmBaseAct}
      type={props.type}
      canSave={props.canSave}
    />
  );
};

export default compose<ViewInspectPgmBaseButtonSubmitProps, ViewInspectPgmBaseButtonSubmitOwnProps>(
  connect<{}, ViewInspectPgmBaseButtonSubmitDispatchProps, ViewInspectPgmBaseButtonSubmitOwnProps, {}, ReduxState>(
    null,
    (dispatch: any) => ({
      actionUpdateInspectPgmBase: (...arg) => (
        dispatch(
          inspectionActions.actionUpdateInspectPgmBase(...arg),
        )
      ),
      actionCloseInspectPgmBase: (...arg) => (
        dispatch(
          inspectionActions.actionCloseInspectPgmBase(...arg),
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
)(ViewInspectPgmBaseButtonSubmit);
