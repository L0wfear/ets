import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsBatteryManufacturer } from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/form/@types/BatteryManufacturerForm';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const batteryManufacturerFormSchema: SchemaType<BatteryManufacturer, PropsBatteryManufacturer> = {
  properties: {
    name: {
      title: 'Производитель аккумулятора',
      type: 'string',
      required: true,
    },
  },
};
