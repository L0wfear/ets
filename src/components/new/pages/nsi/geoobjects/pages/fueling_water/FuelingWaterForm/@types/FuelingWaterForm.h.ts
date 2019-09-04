import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsFuelingWaterFormWrap = {
  showForm: boolean;
  element: FuelingWater | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsFuelingWaterForm = {
  userData: InitialStateSession['userData'];
};
export type OwnPropsFuelingWaterForm = {
  element: FuelingWater | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsFuelingWaterFormWithForm = (
  StatePropsFuelingWaterForm
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
