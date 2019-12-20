import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsFuelCards } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { getRequiredFieldMessage, getRequiredFieldDateMoreThen } from 'components/@next/@utils/getErrorString/getErrorString';
import { diffDates } from 'components/@next/@utils/dates/dates';

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
    released_at: {
      title: 'Дата выпуска',
      type: 'datetime',
      required: true,
    },
    date_end: {
      title: 'Дата окончания срока действия',
      type: 'datetime',
      dependencies: [
        (value, { date_end, released_at, }) => {
          if (!value) {
              return getRequiredFieldMessage('Дата окончания срока действия');
          }
          if (diffDates(date_end, released_at) <= 0) {
            return getRequiredFieldDateMoreThen('Дата окончания срока действия', 'даты выпуска');
          }
          return '';
        },
      ],
    },
  },
};
