import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { FuelingWater, CreateFuelingWater, UpdateFuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFuelingWaterFormWrap = {
  showForm: boolean;
  element: FuelingWater | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsFuelingWaterForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsFuelingWaterForm = {
  createAction: CreateFuelingWater;
  updateAction: UpdateFuelingWater;
};
export type OwnPropsFuelingWaterForm = {
  element: FuelingWater | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsFuelingWaterFormWithForm = (
  StatePropsFuelingWaterForm
  & DispatchPropsFuelingWaterForm
  & OwnPropsFuelingWaterForm
);

export type PropsFuelingWaterForm = OutputWithFormProps<
  PropsFuelingWaterFormWithForm,
  FuelingWater,
  [ FuelingWater ],
  any
>;
export type StateFuelingWaterForm = {
};
