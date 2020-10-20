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
        (value, { factory_number }, { tachographList } ) => {
          if (!value) {
            return getRequiredFieldMessage('Дата проведения поверки');
          }
          if (factory_number) {
            const chosenTachograph = tachographList?.find((tachograph) => tachograph.factory_number === factory_number);
            if (diffDates(chosenTachograph?.installed_at, value, 'days') > 0) {
              return 'Дата поверки не может быть раньше даты установки тахографа';
            }
          }
          if (diffDates(value, getDateWithMoscowTz()) > 0) {
            return 'Дата поверки не может быть больше текущей';
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
    tachograph_id: {
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
          if (!value.length) {
            return getRequiredFieldMessage('Сертификат');
          }
          return false;
        }
      ],
    },
    gov_number: {
      title: 'Рег. номер ТС',
      type: 'string',
      dependencies: [
        (value) => {
          if (!value) {
            return getRequiredFieldMessage('Рег. номер ТС');
          }
          return false;
        }
      ],
    },
  },
};
