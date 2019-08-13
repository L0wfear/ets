import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTechMaintOrder } from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/form/@types/TechMaintenanceOrderForm';

import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';

export const techMaintOrderFormSchema: SchemaType<TechMaintOrder, PropsTechMaintOrder> = {
  properties: {
    tech_maintenance_type_id: {
      title: 'Тип ТО',
      type: 'valueOfArray',
      required: true,
    },
    sequence: {
      title: 'Последовательность ТО',
      type: 'valueOfArray',
      dependencies: [
        (value, { is_periodic }) => {
          if (!is_periodic && !value) {
            return getRequiredFieldMessage('Последовательность ТО');
          }

          return '';
        },
      ],
    },
    description: {
      title: 'Описание',
      type: 'string',
      maxLength: 2048,
    },
    car_model_id: {
      title: 'Модель ТС',
      type: 'valueOfArray',
      required: true,
    },
    is_periodic: {
      title: 'Признак периодического ТО',
      type: 'boolean',
      required: false,
    },
    interval_probeg: {
      title: 'Интервал до следующего ТО (по пробегу)',
      type: 'number',
      maxLength: 128,
      required: true,
      integer: true,
    },
    measure_unit_run_id: {
      title: 'Пробег измеряется',
      type: 'number',
      integer: true,
      required: true,

      dependencies: [
        (_, { tech_maintenance_type_id }) => {
          if (!tech_maintenance_type_id) {
            return getRequiredFieldMessage('Тип ТО');
          }

          return '';
        },
      ],
    },
    interval_time: {
      title: 'Интервал до следующего ТО (по времени)',
      type: 'number',
      maxLength: 128,
      integer: true,
    },
    interval_time_type: {
      title: 'Время измеряется',
      type: 'valueOfArray',
    },
  },
};
