import {
  FuelCards,
  Company,
  FuelType,
  AutobaseCreateFuelCards,
  AutobaseUpdateFuelCards,
  getFuelType,
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
  // companiesList: Company[] | null;
  companiesList: any;
  fuelTypeList: FuelType[];
};
export type DispatchPropsFuelCards = {
  createAction: AutobaseCreateFuelCards;
  updateAction: AutobaseUpdateFuelCards;
  getFuelType: getFuelType;
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
