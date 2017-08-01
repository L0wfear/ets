import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'number',
      title: 'Номер',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    {
      key: 'name',
      title: 'Наименование',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    {
      key: 'quantity',
      title: 'Количество',
      type: 'number',
      required: true,
      maxLength: 128,
      min: 0,
    },
    {
      key: 'spare_part_group_id',
      title: 'Группа',
      type: 'number',
      required: true,
    },
    {
      key: 'measure_unit_id',
      title: 'Единица измерения',
      type: 'number',
      required: true,
    },
    {
      key: 'supplied_at',
      title: 'Дата поставки',
      type: 'date',
    },
  ],
};
