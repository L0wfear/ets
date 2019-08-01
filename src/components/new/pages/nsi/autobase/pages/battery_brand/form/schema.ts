import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsBatteryBrand } from 'components/new/pages/nsi/autobase/pages/battery_brand/form/@types/BatteryBrandForm';
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
