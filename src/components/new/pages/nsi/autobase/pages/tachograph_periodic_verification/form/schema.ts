import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTachograph } from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/form/@types/TachographPeriodicVerificationForm';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';

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
      dependencies: [ // указать зависимости
        () => {
          return false;
        }
      ] 
    },
    calibration_type_name: {
      title: 'Тип калибровки',
      type: 'boolean',
      required: true,
    },
    verification_reason_name: {
      title: 'Причина внеплановой калибровки',
      type: 'multiValueOfArray',
      dependencies: [], // указать зависимости
    },
    other_reason: {
      title: 'Другое',
      type: 'string',
      dependencies: [], // указать зависимости
    },
    next_calibration_date: {
      title: 'Дата следующей калибровки (план)',
      type: 'date',
      required: true,
    },
    tachograph_brand_name: {
      title: 'Марка тахографа',
      type: 'valueOfArray',
      required: true,
    },
    factory_number: {
      title: 'Заводской номер тахографа',
      type: 'valueOfArray',
      required: true,
    },
    gov_number: {
      title: 'Рег. номер ТС',
      type: 'valueOfArray',
      required: true,
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
    },
    files: {
      title: 'Файл',
      type: 'multiValueOfArray',
    },
  },
};
