import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { PropsConsumableMaterial } from './@types/ConsumableMaterialForm';

export const consumableMaterialFormSchema: SchemaType<ConsumableMaterial, PropsConsumableMaterial> = {
  properties: {
    name: {
      title: 'Наименование',
      type: 'string',
      required: true,
    },
    measure_unit_id: {
      title: 'Единица измерения',
      type: 'valueOfArray',
      required: true,
    },
  },
};
