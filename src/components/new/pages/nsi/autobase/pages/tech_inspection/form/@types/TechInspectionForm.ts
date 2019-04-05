import {
  TechInspection,
  Car,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';

import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { HandleThunkActionCreator } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { CarWrap } from '../../../car_actual/form/@types/CarForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsTechInspectionFormLazy = {
  showForm: boolean;
  element: TechInspection | null;
  selectedCarData?: CarWrap;

  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsTechInspection = {
  userCompanyId: InitialStateSession['userData']['company_id'];
};
export type DispatchPropsTechInspection = {
  autobaseGetSetCar: HandleThunkActionCreator<
    typeof autobaseActions.autobaseGetSetCar
  >;
};
export type OwnTechInspectionProps = {
  element: TechInspection | null;
  handleHide: OnFormHideType;
  selectedCarData?: CarWrap;

  page: string;
  path?: string;
};

export type PropsTechInspectionWithForm = (
  StatePropsTechInspection
  & DispatchPropsTechInspection
  & OwnTechInspectionProps
);

export type PropsTechInspection = OutputWithFormProps<
  PropsTechInspectionWithForm,
  TechInspection,
  [TechInspection],
  any
>;
export type StateTechInspection = {
  carListOptions: DefaultSelectOption<
    Car['asuods_id'],
    Car['gov_number'],
    Car
  >[];
};
