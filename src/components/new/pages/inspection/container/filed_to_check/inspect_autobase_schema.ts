import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

export const inspectContainerSchema: SchemaType<any, { type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM }> = {
  properties: {
    number: {
      title: 'Порядковый и/или инвентарный номер емкости',
      type: 'string',
      required: true,
    },
    capacity: {
      title: 'Вместимость (куб. м)',
      type: 'number',
      required: true,
    },
    capacity_percent: {
      title: 'Коэффициент заполнения на день проверки',
      type: 'number',
      required: true,
    },
    pgm_marka: {
      title: 'Марка ПГМ',
      type: 'string',
      required: true,
    },
    pgm_volume: {
      title: 'Объем ПГМ (тонн)',
      type: 'number',
      required: true,
    },
    last_checked_at: {
      title: 'Дата последней диагностики',
      type: 'date',
    },
    diagnostic_result: {
      title: 'Результат диагностики',
      type: 'string',
    },
  },
};
