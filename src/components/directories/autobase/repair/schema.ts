import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'car_id',
      title: 'Регистрационный номер',
      type: 'number',
      required: true,
    },
    {
      key: 'repair_company_id',
      title: 'Исполнитель ремонта',
      type: 'number',
      required: true,
    },
    {
      key: 'repair_type_id',
      title: 'Вид ремонта',
      type: 'number',
      required: true,
    },
    {
      key: 'number',
      title: 'Регистрационный номер',
      type: 'number',
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
  ],
};