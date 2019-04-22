import * as React from 'react';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { compose } from 'recompose';
import { saveData } from 'utils/functions';
import { get } from 'lodash';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import ViewInspectButtonSubmit from 'components/new/pages/inspection/common_components/form_wrap_check/buttons/ViewInspectButtonSubmit';

type ViewInspectAutobaseButtonSubmitDispatchProps = {
  actionUpdateInspectAutobase: HandleThunkActionCreator<typeof inspectionAutobaseActions.actionUpdateInspectAutobase>;
  actionCloseInspectAutobase: HandleThunkActionCreator<typeof inspectionAutobaseActions.actionCloseInspectAutobase>;
  actionGetBlobActInspect: HandleThunkActionCreator<typeof inspectionActions.actionGetBlobActInspect>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
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
        try {
          await props.actionUpdateInspectAutobase(
            selectedInspectAutobase,
            { page: props.loadingPage },
          );
        } catch (error) {
          props.registryLoadDataByKey(props.loadingPage);
        }

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

  const handleCloseAndAutobaseAct = React.useCallback( // хендлер на закрытие акта
    async () => {
      if (canSave) {
        try {
          await props.actionCloseInspectAutobase(
            selectedInspectAutobase,
            { page: props.loadingPage },
          );
          props.handleHide(true);
          await handleGetAutobaseAct();
        } catch (error) {
          // tslint:disable-next-line:no-console
          console.error(error);
          props.registryLoadDataByKey(props.loadingPage);
        }
      }
    },
    [selectedInspectAutobase, canSave],
  );

  return (
    <ViewInspectButtonSubmit
      handleSubmit={handleSubmit}
      handleCloseAndGetAct={handleCloseAndAutobaseAct}
      handleGetAct={handleGetAutobaseAct}
      type={props.type}
      canSave={props.canSave}
    />
  );
};

export default compose<ViewInspectAutobaseButtonSubmitProps, ViewInspectAutobaseButtonSubmitOwnProps>(
  withSearch,
  connect<{}, ViewInspectAutobaseButtonSubmitDispatchProps, ViewInspectAutobaseButtonSubmitOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionUpdateInspectAutobase: (...arg) => (
        dispatch(
          inspectionAutobaseActions.actionUpdateInspectAutobase(...arg),
        )
      ),
      actionCloseInspectAutobase: (...arg) => (
        dispatch(
          inspectionAutobaseActions.actionCloseInspectAutobase(...arg),
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
)(ViewInspectAutobaseButtonSubmit);
