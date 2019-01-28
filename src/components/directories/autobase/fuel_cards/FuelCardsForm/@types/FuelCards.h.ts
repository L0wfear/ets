import {
  FuelCards,
  Company,
  FuelType,
  AutobaseCreateFuelCards,
  AutobaseUpdateFuelCards,
} from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFuelCardsFormWrap = {
  showForm: boolean;
  element: FuelCards | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsFuelCards = {
  companiesList: Company[] | null;
  fuelType: object | null;
  userCompany: Company | null;
};
export type DispatchPropsFuelCards = {
  createAction: AutobaseCreateFuelCards;
  updateAction: AutobaseUpdateFuelCards;
};
export type OwnFuelCardsProps = {
  element: FuelCards | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsFuelCardsWithForm = (
  StatePropsFuelCards
  & DispatchPropsFuelCards
  & OwnFuelCardsProps
);

export type PropsFuelCards = OutputWithFormProps<
  PropsFuelCardsWithForm,
  FuelCards,
  [ FuelCards ],
  any
>;
export type StateFuelCards = {
  companyOptions: DefaultSelectListMapper<Company['asuods_id'], Company['name'], Company>;
  fuelTypeOptions: DefaultSelectListMapper<FuelType['id'], FuelType['name'], FuelType>;
};
