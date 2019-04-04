import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsFuelCards } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCards } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

export const fuelCardsFormSchema: SchemaType<FuelCards, PropsFuelCards> = {
  properties: [
    {
      key: 'number',
      title: 'Номер',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    {
      key: 'fuel_type',
      title: 'Тип топлива',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'company_id',
      title: 'Организация',
      type: 'valueOfArray',
      required: true,
    },
  ],
};
