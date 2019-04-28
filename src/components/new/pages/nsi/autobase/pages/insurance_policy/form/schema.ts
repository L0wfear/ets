import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsInsurancePolicy } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/@types/InsurancePolicyForm';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { diffDates } from 'utils/dates';

export const insurancePolicyFormSchema: SchemaType<InsurancePolicy, PropsInsurancePolicy> = {
  properties: {
    car_id: {
      title: 'Номер транспортного средства',
      type: 'valueOfArray',
      required: true,
    },
    insurer: {
      title: 'Страховая организация',
      type: 'string',
      required: true,
      maxLength: 256,
    },
    insurance_type_id: {
      title: 'Тип страхования',
      type: 'valueOfArray',
      required: true,
    },
    seria: {
      title: 'Серия',
      type: 'string',
    },
    number: {
      title: 'Номер',
      type: 'string',
      maxLength: 128,
      required: true,
    },
    date_start: {
      title: 'Дата начала действия',
      type: 'date',
      required: true,
    },
    date_end: {
      title: 'Дата окончания действия',
      type: 'date',
      required: true,
      dependencies: [
        (value, { date_start }) => {
          if (value && date_start) {
            if (diffDates(date_start, value) >= 0) {
              return '"Дата окончания действия" должна быть позже "Даты начала действия"';
            }
          }

          return '';
        },
      ],
    },
    price: {
      title: 'Стоимость, руб.',
      type: 'number',
      maxLength: 128,
      min: 0,
      integer: false,
      float: 2,
    },
    note: {
      title: 'Примечание',
      type: 'string',
      maxLength: 2048,
    },
  },
};
