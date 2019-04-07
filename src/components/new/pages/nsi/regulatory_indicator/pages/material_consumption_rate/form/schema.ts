import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsMaterialConsumptionRate } from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/form/@types/MaterialConsumptionRateForm';
import { MaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

export const materialConsumptionRateSchema: SchemaType<MaterialConsumptionRate, PropsMaterialConsumptionRate> = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'consumable_material_id',
      title: 'Расходный материал',
      type: 'number',
      required: true,
    },
    {
      key: 'season_id',
      title: 'Сезон',
      type: 'number',
      required: true,
    },
    {
      key: 'clean_category_id',
      title: 'Категория',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'clean_subcategory_id',
      title: 'Подкатегория',
      type: 'number',
      required: false,
    },
    {
      key: 'value',
      title: 'Норма',
      type: 'number',
      float: 3,
      required: true,
    },
  ],
};
