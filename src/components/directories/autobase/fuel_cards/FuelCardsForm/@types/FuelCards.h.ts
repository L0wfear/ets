import {
  FuelCards,
  FuelType,
} from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import {
  GetSessionCompanyOptionsAns,
  getSessionStructuresParams,
} from 'redux-main/reducers/modules/session/selectors';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFuelCardsFormWrap = {
  showForm: boolean;
  element: FuelCards | null;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsFuelCards = {
  companyOptions: GetSessionCompanyOptionsAns;
  fuelTypeOptions: InitialStateSession['appConfig']['enums']['FUEL_TYPE'];
  userCompanyId: InitialStateSession['userData']['company_id'];
  userStructureId: number | null;
  // userStructures: InitialStateSession['userData']['structures'];
  STRUCTURE_FIELD_VIEW: ReturnType<
    typeof getSessionStructuresParams
  >['STRUCTURE_FIELD_VIEW'];
};
export type DispatchPropsFuelCards = {};
export type OwnFuelCardsProps = {
  element: FuelCards | null;
  handleHide: OnFormHideType;
  page: string;
  path?: string;
};

export type PropsFuelCardsWithForm = StatePropsFuelCards &
  DispatchPropsFuelCards &
  OwnFuelCardsProps;

export type PropsFuelCards = OutputWithFormProps<
  PropsFuelCardsWithForm,
  FuelCards,
  [FuelCards],
  any
>;
export type StateFuelCards = {
  fuelTypeOptions: DefaultSelectListMapper<FuelType>;
  companyStructureOptions: any; // <<< Заменить
  structure_id: any;
};
