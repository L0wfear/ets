import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsBatteryRegistry } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/@types/BatteryRegistryForm';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const batteryRegistryFormSchema: SchemaType<BatteryRegistry, PropsBatteryRegistry> = {
  properties: [
    {
      key: 'brand_id',
      title: 'Марка аккумулятора',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'serial_number',
      title: 'Серийный номер',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    {
      key: 'lifetime_months',
      title: 'Срок службы, мес.',
      type: 'number',
      required: true,
      maxLength: 128,
      integer: true,
    },
    {
      key: 'released_at',
      title: 'Дата выпуска',
      type: 'date',
      required: true,
    },
  ],
};
