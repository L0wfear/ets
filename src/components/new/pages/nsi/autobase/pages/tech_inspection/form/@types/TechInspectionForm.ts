import {
  TechInspection,
  Car,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
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
export type OwnTechInspectionProps = {
  element: TechInspection | null;
  handleHide: OnFormHideType;
  selectedCarData?: CarWrap;

  page: string;
  path?: string;
};

export type PropsTechInspectionWithForm = (
  StatePropsTechInspection
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
