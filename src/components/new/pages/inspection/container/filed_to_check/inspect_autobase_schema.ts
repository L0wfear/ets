import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import { PropsInspectContainerWithForm } from '../@types/InspectionContainerList';

export const inspectContainerSchema: SchemaType<InspectContainer, PropsInspectContainerWithForm> = {
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
      title: 'Марка ПГМ в емкости',
      type: 'string',
      required: true,
    },
    pgm_volume: {
      title: 'Объем ПГМ в емкости (тонн)',
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
