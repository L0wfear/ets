import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTachographRepair } from 'components/new/pages/nsi/autobase/pages/tachograph_repair/form/@types/TachographRepairForm';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';
import {diffDates, getDateWithMoscowTz} from 'components/@next/@utils/dates/dates';

export const tachographRepairFormSchema: SchemaType<TachographRepair, PropsTachographRepair> = {
  properties: {
    tachograph_brand_name: {
      title: 'Марка тахографа',
      type: 'string',
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
        (value, { factory_number }, { tachographList } ) => {
          if (!value) {
            return getRequiredFieldMessage('Заводской номер тахографа');
          }
          if (factory_number) {
            const chosenTachograph = tachographList?.find((tachograph) => tachograph.factory_number === factory_number);
            if (diffDates(chosenTachograph?.installed_at, value, 'days') > 0) {
              return 'Дата ремонта не может быть раньше даты установки тахографа';
            }
          }
          if (diffDates(value, getDateWithMoscowTz()) > 0) {
            return 'Дата ремонта не может быть больше текущей';
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
    gov_number: {
      title: 'Рег. номер ТС',
      type: 'string',
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
    },
  },
};
