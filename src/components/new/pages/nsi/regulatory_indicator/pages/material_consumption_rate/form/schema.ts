import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsMaterialConsumptionRate } from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/form/@types/MaterialConsumptionRateForm';
import { MaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

export const materialConsumptionRateSchema: SchemaType<MaterialConsumptionRate, PropsMaterialConsumptionRate> = {
  properties: {
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    consumable_material_id: {
      title: 'Расходный материал',
      type: 'number',
      required: true,
    },
    season_id: {
      title: 'Сезон',
      type: 'number',
      required: true,
    },
    clean_category_id: {
      title: 'Категория',
      type: 'valueOfArray',
      required: true,
    },
    clean_subcategory_id: {
      title: 'Подкатегория',
      type: 'number',
      required: false,
    },
    value: {
      title: 'Норма',
      type: 'number',
      float: 3,
      required: true,
    },
  },
};
