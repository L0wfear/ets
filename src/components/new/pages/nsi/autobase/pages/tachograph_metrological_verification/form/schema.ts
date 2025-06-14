import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTachographMetrologicalVerification } from 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/form/@types/TachographMetrologicalVerificationForm';
import { TachographMetrologicalVerification } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';
import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';
import { diffDates, getDateWithMoscowTz } from 'components/@next/@utils/dates/dates';

export const tachographMetrologicalVerificationFormSchema: SchemaType<TachographMetrologicalVerification, PropsTachographMetrologicalVerification> = {
  properties: {
    verification_number: {
      title: 'Номер поверки',
      type: 'string',
      dependencies: [
        (value) => {
          if (!value) {
            return getRequiredFieldMessage('Номер поверки');
          }
          return false;
        }
      ],
    },
    verification_date: {
      title: 'Дата проведения поверки',
      type: 'date',
      dependencies: [
        (value, { factory_number, gov_number } ) => {
          if (!value) {
            return getRequiredFieldMessage('Дата проведения поверки');
          }
          if (diffDates(value, getDateWithMoscowTz()) > 0) {
            return 'Дата поверки не может быть больше текущей';
          }
          if (value && !gov_number && factory_number) {
            return 'В указанную дату тахограф не был установлен ни на одно ТС';
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
    files: {
      title: 'Сертификат',
      type: 'multiValueOfArray',
      dependencies: [
        (value) => {
          if(!value.length || value.every((el) => el?.action === 'delete')) {
            return 'Поле "Сертификат" обязательно для заполнения';
          }
        }
      ],
    },
  },
};
