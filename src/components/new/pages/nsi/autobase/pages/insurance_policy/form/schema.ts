import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsInsurancePolicy } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/@types/InsurancePolicyForm';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { diffDates } from 'components/@next/@utils/dates/dates';

const validateIf = {
  type: 'equal_to_value',
  path: 'is_not_insurable',
  value: false,
} as const;

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
      validateIf,
    },
    insurance_type_id: {
      title: 'Тип страхования',
      type: 'valueOfArray',
      required: true,
      validateIf,
    },
    seria: {
      title: 'Серия',
      type: 'string',
      maxLength: 128,
      validateIf,
    },
    number: {
      title: 'Номер',
      type: 'string',
      maxLength: 128,
      required: true,
      validateIf,
    },
    date_start: {
      title: 'Дата начала действия',
      type: 'date',
      required: true,
      validateIf,
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
      validateIf,
    },
    price: {
      title: 'Стоимость, руб.',
      type: 'number',
      maxLength: 128,
      min: 0,
      integer: false,
      float: 2,
      validateIf,
    },
    note: {
      title: 'Примечание',
      type: 'string',
      maxLength: 2048,
    },
  },
};
