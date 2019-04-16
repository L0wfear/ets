import { HandleThunkActionCreator } from "react-redux";
import { InspectCarsCondition } from "redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition";
import { INSPECT_AUTOBASE_TYPE_FORM } from "components/new/pages/inspection/autobase/global_constants";

import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import inspectionCarsConditionActions from "redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions";

export type OnFormHideType = (isSubmitted: any, result?: any) => void;

export type ViewInspectCarsConditionStateProps = {};
export type ViewInspectCarsConditionDispatchProps = {
  autobaseGetCarsConditionCars: HandleThunkActionCreator<typeof inspectionCarsConditionActions.autobaseGetCarsConditionCars>,
};
export type ViewInspectCarsConditionOwnProps = {
  element: InspectCarsCondition;
  type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM;
  handleHide: OnFormHideType;

  loadingPage: string;
  page: string;
  path?: string;
};

type ViewInspectCarsConditionMergedProps = (
  ViewInspectCarsConditionStateProps
  & ViewInspectCarsConditionDispatchProps
  & ViewInspectCarsConditionOwnProps
);

export type PropsViewInspectCarsConditionWithForm = ViewInspectCarsConditionMergedProps;

export type ViewInspectCarsConditionProps = OutputWithFormProps<
  PropsViewInspectCarsConditionWithForm,
  InspectCarsCondition,
  [ InspectCarsCondition ],
  any
>;
