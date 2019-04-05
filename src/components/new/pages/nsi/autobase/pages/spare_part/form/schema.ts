import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsSparePart } from 'components/new/pages/nsi/autobase/pages/spare_part/form/@types/SparePartForm';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const sparePartFormSchema: SchemaType<SparePart, PropsSparePart> = {
  properties: [
    {
      key: 'number',
      title: 'Номер поставки',
      type: 'string',
      maxLength: 128,
      required: true,
    },
    {
      key: 'name',
      title: 'Подгруппа',
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
      integer: true,
    },
    {
      key: 'spare_part_group_id',
      title: 'Группа',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'measure_unit_id',
      title: 'Единица измерения',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'supplied_at',
      title: 'Дата поставки',
      type: 'date',
    },
  ],
};
