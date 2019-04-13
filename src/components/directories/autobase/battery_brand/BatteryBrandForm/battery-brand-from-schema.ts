import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsBatteryBrand } from 'components/directories/autobase/battery_brand/BatteryBrandForm/@types/BatteryBrand.h';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const batteryBrandFormSchema: SchemaType<BatteryBrand, PropsBatteryBrand> = {
  properties: {
    name: {
      title: 'Марка аккумулятора',
      type: 'string',
      required: true,
    },
    manufacturer_id: {
      title: 'Производитель аккумулятора',
      type: 'valueOfArray',
      required: true,
    },
  },
};
