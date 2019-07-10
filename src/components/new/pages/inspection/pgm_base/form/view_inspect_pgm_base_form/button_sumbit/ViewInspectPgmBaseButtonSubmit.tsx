import * as React from 'react';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { compose } from 'recompose';
import { saveData } from 'utils/functions';
import { get } from 'lodash';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import ViewInspectButtonSubmit from 'components/new/pages/inspection/common_components/form_wrap_check/buttons/ViewInspectButtonSubmit';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

type ViewInspectPgmBaseButtonSubmitDispatchProps = {
  actionCloseInspectPgmBase: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionCloseInspectPgmBase>;
  actionGetBlobActInspect: HandleThunkActionCreator<typeof inspectionActions.actionGetBlobActInspect>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};

type ViewInspectPgmBaseButtonSubmitOwnProps = {
  type: keyof typeof INSPECT_TYPE_FORM;
  handleHide: (isSubmitted: boolean) => any;
  selectedInspectPgmBase: InspectPgmBase;
  canSave: boolean;
  loadingPage: string;

  handleSubmit: any;

  isPermittedToUpdateClose: boolean;
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
        try {
          await props.handleSubmit();
        } catch (error) {
          props.registryLoadDataByKey(props.loadingPage);
        }
        props.handleHide(true);
      }
    },
    [props.handleSubmit, canSave],
  );

  const handleSaveGetAct = React.useCallback(
    async () => {
      if (canSave) {
        try {
          await props.handleSubmit();
          await handleGetPgmBaseAct();
        } catch (error) {
          props.registryLoadDataByKey(props.loadingPage);
        }
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

  const handleClosePgmBaseAct = React.useCallback( // хендлер на закрытие акта
    async () => {
      if (canSave) {
        try {
          await props.actionCloseInspectPgmBase(
            selectedInspectPgmBase,
            { page: props.loadingPage },
          );
          props.handleHide(true);
        } catch (error) {
          // tslint:disable-next-line:no-console
          console.error(error);
          props.registryLoadDataByKey(props.loadingPage);
        }
      }
    },
    [selectedInspectPgmBase, canSave],
  );

  return (
    <ViewInspectButtonSubmit
      handleSubmit={handleSubmit}
      isPermittedToUpdateClose={props.isPermittedToUpdateClose}
      handleSubmitClosed={handleSubmit}
      handleCloseAct={handleClosePgmBaseAct}
      handleGetAct={handleGetPgmBaseAct}
      type={props.type}
      canSave={props.canSave}
      handleSaveGetAct={handleSaveGetAct}
    />
  );
};

export default compose<ViewInspectPgmBaseButtonSubmitProps, ViewInspectPgmBaseButtonSubmitOwnProps>(
  withSearch,
  connect<{}, ViewInspectPgmBaseButtonSubmitDispatchProps, ViewInspectPgmBaseButtonSubmitOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionCloseInspectPgmBase: (...arg) => (
        dispatch(
          inspectionPgmBaseActions.actionCloseInspectPgmBase(...arg),
        )
      ),
      actionGetBlobActInspect: (...arg) => (
        dispatch(
          inspectionActions.actionGetBlobActInspect(...arg),
        )
      ),
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
    }),
  ),
)(ViewInspectPgmBaseButtonSubmit);
