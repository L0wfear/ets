import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsFuelCards } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

export const fuelCardsFormSchema: SchemaType<FuelCard, PropsFuelCards> = {
  properties: {
    number: {
      title: 'Номер',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    fuel_type: {
      title: 'Тип топлива',
      type: 'valueOfArray',
      required: true,
    },
    company_id: {
      title: 'Организация',
      type: 'valueOfArray',
      required: true,
    },
  },
};
