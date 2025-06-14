import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsRepair } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/form/@types/RepairForm';
import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';
import { diffDates } from 'components/@next/@utils/dates/dates';

export const repairFormSchema: SchemaType<Repair, PropsRepair> = {
  properties: {
    car_id: {
      title: 'Регистрационный номер',
      type: 'valueOfArray',
      required: true,
    },
    repair_company_id: {
      title: 'Исполнитель ремонта',
      type: 'valueOfArray',
      required: true,
    },
    repair_type_id: {
      title: 'Вид ремонта',
      type: 'valueOfArray',
      required: true,
    },
    number: {
      title: 'Номер документа',
      type: 'string',
      maxLength: 128,
    },
    plan_date_start: {
      title: 'Плановая дата начала ремонта',
      type: 'date',
      required: true,
    },
    plan_date_end: {
      title: 'Плановая дата окончания ремонта',
      type: 'date',
      required: true,
      dependencies: [
        (value, { plan_date_start }) => {
          if (plan_date_start && value) {

            if (diffDates(value, plan_date_start) < 0) {
              return '"Плановая дата окончания" должна быть позже "Плановой даты начала ремонта"';
            }
          }

          return '';
        },
      ],
    },
    fact_date_start: {
      title: 'Фактическая дата начала ремонта',
      type: 'date',
    },
    fact_date_end: {
      title: 'Фактическая дата окончания ремонта',
      type: 'date',
      dependencies: [
        (value, { fact_date_start }) => {
          if (fact_date_start && value) {

            if (diffDates(value, fact_date_start) < 0) {
              return '"Фактическая дата окончания" должна быть позже "Фактической даты начала ремонта"';
            }
          }

          return '';
        },
      ],
    },
    description: {
      title: 'Описание неисправности',
      type: 'string',
      maxLength: 4096,
      required: true,
    },
    note: {
      title: 'Примечание прохождения',
      type: 'string',
      maxLength: 2048,
    },
    status: {
      title: 'Итог проведенного ремонта',
      type: 'valueOfArray',
      dependencies: [
        (value, { fact_date_start, fact_date_end }) => {
          if (fact_date_start && fact_date_end && !value) {
            return getRequiredFieldMessage('Итог проведенного ремонта');
          }

          return '';
        },
      ],
    },
  },
};
