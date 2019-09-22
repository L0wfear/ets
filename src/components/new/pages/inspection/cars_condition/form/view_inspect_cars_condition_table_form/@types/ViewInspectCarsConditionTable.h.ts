import { HandleThunkActionCreator } from 'react-redux';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';

export type OnFormHideType = (isSubmitted: any, result?: any) => void;

export type ViewInspectCarsConditionTableStateProps = {};
export type ViewInspectCarsConditionTableDispatchProps = {
  autobaseGetCarsConditionCars: HandleThunkActionCreator<typeof inspectionCarsConditionActions.autobaseGetCarsConditionCars>,
};
export type ViewInspectCarsConditionTableOwnProps = {
  element: InspectCarsCondition;
  type: keyof typeof INSPECT_TYPE_FORM;
  handleHide: OnFormHideType;
  handleCloseWithoutChanges: any;

  loadingPage: string;
  page: string;
  path?: string;
};

type ViewInspectCarsConditionTableMergedProps = (
  ViewInspectCarsConditionTableStateProps
  & ViewInspectCarsConditionTableDispatchProps
  & ViewInspectCarsConditionTableOwnProps
) & {
  isPermittedToUpdateClose: boolean;
};

export type PropsViewInspectCarsConditionTableWithForm = ViewInspectCarsConditionTableMergedProps;

export type ViewInspectCarsConditionTableProps = OutputWithFormProps<
  PropsViewInspectCarsConditionTableWithForm,
  InspectCarsCondition,
  [ InspectCarsCondition ],
  any
>;
