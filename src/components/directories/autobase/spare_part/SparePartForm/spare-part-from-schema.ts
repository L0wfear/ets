import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsSparePart } from 'components/directories/autobase/spare_part/SparePartForm/@types/SparePart.h';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const sparePartFormSchema: SchemaType<SparePart, PropsSparePart> = {
  properties: {
    number: {
      title: 'Номер поставки',
      type: 'string',
      maxLength: 128,
      required: true,
    },
    name: {
      title: 'Подгруппа',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    quantity: {
      title: 'Количество',
      type: 'number',
      required: true,
      maxLength: 128,
      min: 0,
      integer: true,
    },
    spare_part_group_id: {
      title: 'Группа',
      type: 'valueOfArray',
      required: true,
    },
    measure_unit_id: {
      title: 'Единица измерения',
      type: 'valueOfArray',
      required: true,
    },
    supplied_at: {
      title: 'Дата поставки',
      type: 'date',
    },
  },
};
