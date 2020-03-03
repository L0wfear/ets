import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { compose } from 'recompose';
import { saveData } from 'utils/functions';
import { get } from 'lodash';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import ViewInspectButtonSubmit from 'components/new/pages/inspection/common_components/form_wrap_check/buttons/ViewInspectButtonSubmit';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

type ViewInspectCarsConditionButtonSubmitDispatchProps = {
  actionCloseInspectCarsCondition: HandleThunkActionCreator<typeof inspectionCarsConditionActions.actionCloseInspectCarsCondition>;
  actionGetBlobActInspect: HandleThunkActionCreator<typeof inspectionActions.actionGetBlobActInspect>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};

type ViewInspectCarsConditionButtonSubmitOwnProps = {
  handleSubmit: any;
  type: keyof typeof INSPECT_TYPE_FORM;
  handleHide: (isSubmitted: boolean) => any;
  selectedInspectCarsCondition: InspectCarsCondition;
  canSave: boolean;
  loadingPage: string;

  isPermittedToUpdateClose: boolean;
  id: number;
  registryPage: string;
};

type ViewInspectCarsConditionButtonSubmitProps = (
  ViewInspectCarsConditionButtonSubmitDispatchProps
  & ViewInspectCarsConditionButtonSubmitOwnProps
);

const ViewInspectCarsConditionButtonSubmit: React.FC<ViewInspectCarsConditionButtonSubmitProps> = (props) => {
  const { selectedInspectCarsCondition, canSave } = props;

  const handleSubmit = React.useCallback(
    async () => {
      try {
        await props.handleSubmit();
      } catch (error) {
        props.registryLoadDataByKey(props.loadingPage);
        return;
      }
      props.handleHide(true);
    },
    [selectedInspectCarsCondition, canSave],
  );

  const handleSubmitClosed = React.useCallback(
    async () => {
      if (canSave) {
        try {
          await props.handleSubmit('save_closed');
        } catch (error) {
          props.registryLoadDataByKey(props.loadingPage);
          return;
        }
        props.handleHide(true);
      }
    },
    [selectedInspectCarsCondition, canSave],
  );

  const handleSaveGetAct = React.useCallback(
    async () => {
      if (canSave) {
        try {
          await props.handleSubmit('signing');
          await handleGetCarsConditionAct();
        } catch (error) {
          props.registryLoadDataByKey(props.loadingPage);
        }
      }
    },
    [selectedInspectCarsCondition, canSave],
  );

  const handleGetCarsConditionAct = React.useCallback(
    async () => {
      if (canSave) {
        const response = await props.actionGetBlobActInspect(
          selectedInspectCarsCondition.id,
          { page: props.loadingPage },
        );

        const blob = get(response, 'blob', null);
        const fileName = get(response, 'fileName', '');
        if (blob) {
          saveData(blob, fileName);
        }
      }
    },
    [selectedInspectCarsCondition, canSave],
  );

  const handleCloseCarsConditionAct = React.useCallback( // хендлер на закрытие акта
    async () => {
      if (canSave) {
        try {
          await props.actionCloseInspectCarsCondition(
            selectedInspectCarsCondition,
            { page: props.loadingPage },
          );
        } catch (error) {
          props.registryLoadDataByKey(props.loadingPage);
          return;
        }
        props.handleHide(true);
      }
    },
    [selectedInspectCarsCondition, canSave],
  );

  return (
    <ViewInspectButtonSubmit
      handleSubmit={handleSubmit}
      handleSubmitClosed={handleSubmitClosed}
      isPermittedToUpdateClose={props.isPermittedToUpdateClose}
      handleCloseAct={handleCloseCarsConditionAct}
      handleGetAct={handleGetCarsConditionAct}
      type={props.type}
      canSave={props.canSave}
      handleSaveGetAct={handleSaveGetAct}

      id={props.id}
      registryPage={props.registryPage}
    />
  );
};

export default compose<ViewInspectCarsConditionButtonSubmitProps, ViewInspectCarsConditionButtonSubmitOwnProps>(
  connect<{}, ViewInspectCarsConditionButtonSubmitDispatchProps, ViewInspectCarsConditionButtonSubmitOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionCloseInspectCarsCondition: (...arg) => (
        dispatch(
          inspectionCarsConditionActions.actionCloseInspectCarsCondition(...arg),
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
)(ViewInspectCarsConditionButtonSubmit);
