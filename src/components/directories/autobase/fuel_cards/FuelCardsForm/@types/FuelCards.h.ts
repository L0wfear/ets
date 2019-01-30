import {
  FuelCards,
  FuelType,
} from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

import {
  DefaultSelectListMapper,
} from 'components/ui/input/ReactSelect/utils';

import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { GetSessionCompanyOptionsAns } from 'redux-main/reducers/modules/session/selectors';
import {
  OutputWithFormProps,
} from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

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
  companyOptions: GetSessionCompanyOptionsAns;
  fuelType: InitialStateSession['appConfig']['enums']['FUEL_TYPE'];
  userCompany: Company | null; // переписать
};
export type DispatchPropsFuelCards = {
  createAction: typeof autobaseActions.autobaseCreateFuelCards;
  updateAction: typeof autobaseActions.fuelCardsUpdate;
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
  fuelTypeOptions: DefaultSelectListMapper<FuelType>;
};
