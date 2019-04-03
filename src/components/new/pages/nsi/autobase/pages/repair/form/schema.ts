import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsRepair } from 'components/new/pages/nsi/autobase/pages/repair/form/@types/RepairForm';
import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getRequiredFieldMessage } from 'utils/validate';
import { diffDates } from 'utils/dates';

export const repairFormSchema: SchemaType<Repair, PropsRepair> = {
  properties: [
    {
      key: 'car_id',
      title: 'Регистрационный номер',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'repair_company_id',
      title: 'Исполнитель ремонта',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'repair_type_id',
      title: 'Вид ремонта',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'number',
      title: 'Номер документа',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'plan_date_start',
      title: 'Плановая дата начала ремонта',
      type: 'date',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'Плановая дата окончания ремонта',
      type: 'date',
      required: true,
    },
    {
      key: 'fact_date_start',
      title: 'Фактическая дата начала ремонта',
      type: 'date',
    },
    {
      key: 'fact_date_end',
      title: 'Фактическая дата окончания ремонта',
      type: 'date',
    },
    {
      key: 'description',
      title: 'Описание неисправности',
      type: 'string',
      maxLength: 4096,
      required: true,
    },
    {
      key: 'note',
      title: 'Примечание прохождения',
      type: 'string',
      maxLength: 2048,
    },
    {
      key: 'status',
      title: 'Итог проведенного ремонта',
      type: 'valueOfArray',
    },
  ],
  dependencies: {
    plan_date_end: [
      (value, { plan_date_start }) => {
        if (plan_date_start && value) {

          if (diffDates(value, plan_date_start) < 0) {
            return '"Плановая дата окончания" должна быть позже "Плановой даты начала ремонта"';
          }
        }

        return '';
      },
    ],
    fact_date_end: [
      (value, { fact_date_start }) => {
        if (fact_date_start && value) {

          if (diffDates(value, fact_date_start) < 0) {
            return '"Фактическая дата окончания" должна быть позже "Фактической даты начала ремонта"';
          }
        }

        return '';
      },
    ],
    status: [
      (value, { fact_date_start, fact_date_end }) => {
        if (fact_date_start && fact_date_end && !value) {
          return getRequiredFieldMessage('Итог проведенного ремонта');
        }

        return '';
      },
    ],
  },
};
