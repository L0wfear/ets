import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTachograph } from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/form/@types/TachographPeriodicVerificationForm';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import { diffDates, getStartOfToday, createValidDate } from 'components/@next/@utils/dates/dates';

export const tachographPeriodicVerificationFormSchema: SchemaType<Tachograph, PropsTachograph> = {
  properties: {
    verification_number: {
      title: 'Номер поверки',
      type: 'string',
      required: true,
    },
    calibration_date: {
      title: 'Дата калибровки',
      type: 'date',
      required: true,
      dependencies: [
        (value, {dataForValidation, gov_number, factory_number}) => {
          if (value && dataForValidation) {
            return diffDates(createValidDate(value), getStartOfToday()) > 0
              ? 'Дата калибровки не может быть больше текущей'
              : !gov_number && factory_number
                ? 'В указанную дату тахограф не был установлен ни на одно ТС'
                : '';
          }
        }
      ] 
    },
    calibration_type: {
      title: 'Тип калибровки',
      type: 'string',
      required: true,
    },
    verification_reason_id: {
      title: 'Причина внеплановой калибровки',
      type: 'valueOfArray',
      dependencies: [
        (value, {calibration_type}) => {
          if(!value && calibration_type === 'unscheduled') {
            return 'Поле "Причина внеплановой калибровки" обязательно для заполнения';
          }
        }
      ],
    },
    other_reason: {
      title: 'Другое',
      type: 'string',
      dependencies: [
        (value, {verification_reason_id}) => {
          if(!value && verification_reason_id === 7) {
            return 'Поле "Другое" обязательно для заполнения';
          }
        }
      ],
    },
    next_calibration_date: {
      title: 'Дата следующей калибровки (план)',
      type: 'date',
      required: true,
    },
    tachograph_brand_id: {
      title: 'Марка тахографа',
      type: 'valueOfArray',
      required: true,
    },
    factory_number: {
      title: 'Заводской номер тахографа',
      type: 'valueOfArray',
      required: true,
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
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
