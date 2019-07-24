import {
  FuelCard,
} from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import {
  GetSessionCompanyOptionsAns,
  getSessionStructuresParams,
} from 'redux-main/reducers/modules/session/selectors';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFuelCardsFormLazy = {
  element: Partial<FuelCard>;
  onFormHide: OnFormHideType;

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsFuelCards = {
  companyOptions: GetSessionCompanyOptionsAns;
  fuelTypeOptions: any[];
  userCompanyId: InitialStateSession['userData']['company_id'];
  userStructureId: number | null;
  STRUCTURE_FIELD_VIEW: ReturnType<
    typeof getSessionStructuresParams
  >['STRUCTURE_FIELD_VIEW'];
};
export type DispatchPropsFuelCards = {};
export type OwnFuelCardsProps = {
  element: Partial<FuelCard>;
  handleHide: OnFormHideType;
  page: string;
  path?: string;

  fromWaybill?: boolean;
};

export type PropsFuelCardsWithForm = StatePropsFuelCards &
  DispatchPropsFuelCards &
  OwnFuelCardsProps;

export type PropsFuelCards = OutputWithFormProps<
  PropsFuelCardsWithForm,
  FuelCard,
  [FuelCard],
  any
>;
export type StateFuelCards = {
};
