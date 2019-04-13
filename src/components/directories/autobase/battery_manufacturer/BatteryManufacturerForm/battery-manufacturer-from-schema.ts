import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsBatteryManufacturer } from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerForm/@types/BatteryManufacturer.h';
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
