import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTachographRepair } from 'components/new/pages/nsi/autobase/pages/tachograph_repair/form/@types/TachographRepairForm';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';
import {diffDates, getDateWithMoscowTz} from 'components/@next/@utils/dates/dates';

export const tachographRepairFormSchema: SchemaType<TachographRepair, PropsTachographRepair> = {
  properties: {
    tachograph_brand_id: {
      title: 'Марка тахографа',
      type: 'valueOfArray',
      dependencies: [
        (value) => {
          if (!value) {
            return getRequiredFieldMessage('Марка тахографа');
          }
          return false;
        }
      ],
    },
    factory_number: {
      title: 'Заводской номер тахографа',
      type: 'string',
      dependencies: [
        (value) => {
          if (!value) {
            return getRequiredFieldMessage('Заводской номер тахографа');
          }
          return false;
        }
      ],
    },
    repair_date: {
      title: 'Дата проведения ремонта',
      type: 'date',
      dependencies: [
        (value, { factory_number, gov_number } ) => {
          if (!value) {
            return getRequiredFieldMessage('Заводской номер тахографа');
          }
          if (diffDates(value, getDateWithMoscowTz()) > 0) {
            return 'Дата ремонта не может быть больше текущей';
          }
          if (value && !gov_number && factory_number) {
            return 'В указанную дату тахограф не был установлен ни на одно ТС';
          }
          return false;
        }
      ],
    },
    repair_reason_id: {
      title: 'Причина ремонта',
      type: 'number',
      strick: true,
      dependencies: [
        (value) => {
          if (!value) {
            return getRequiredFieldMessage('Причина ремонта');
          }
          return false;
        }
      ],
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
    },
  },
};
