import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsBatteryRegistry } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/@types/BatteryRegistryForm';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const batteryRegistryFormSchema: SchemaType<BatteryRegistry, PropsBatteryRegistry> = {
  properties: {
    brand_id: {
      title: 'Марка аккумулятора',
      type: 'number',
      integer: true,
      required: true,
    },
    serial_number: {
      title: 'Серийный номер',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    lifetime_months: {
      title: 'Срок службы, мес.',
      type: 'number',
      required: true,
      maxLength: 128,
      integer: true,
    },
    released_at: {
      title: 'Дата выпуска',
      type: 'date',
      required: true,
    },
  },
};
