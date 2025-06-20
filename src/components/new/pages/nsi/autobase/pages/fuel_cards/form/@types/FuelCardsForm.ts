import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import {
  GetSessionCompanyOptionsAns,
  getSessionStructuresParams,
} from 'redux-main/reducers/modules/session/selectors';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsFuelCards = {
  companyOptions: GetSessionCompanyOptionsAns;
  userCompanyId: InitialStateSession['userData']['company_id'];
  userStructureId: number | null;
  permissionsSet: InitialStateSession['userData']['permissionsSet'];
  STRUCTURE_FIELD_VIEW: ReturnType<
    typeof getSessionStructuresParams
  >['STRUCTURE_FIELD_VIEW'];
};
export type DispatchPropsFuelCards = {};
export type OwnFuelCardsProps =  WithFormRegistrySearchAddProps<Partial<FuelCard>>;

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
