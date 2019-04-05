import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsTechMaintOrder } from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/form/@types/TechMaintenanceOrderForm';

import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getRequiredFieldMessage } from 'utils/validate';

export const techMaintOrderFormSchema: SchemaType<TechMaintOrder, PropsTechMaintOrder> = {
  properties: [
    {
      key: 'tech_maintenance_type_id',
      title: 'Тип ТО',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'sequence',
      title: 'Последовательность ТО',
      type: 'valueOfArray',
    },
    {
      key: 'description',
      title: 'Описание',
      type: 'string',
      maxLength: 2048,
    },
    {
      key: 'car_model_id',
      title: 'Модель ТС',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'is_periodic',
      title: 'Признак периодического ТО',
      type: 'boolean',
      required: false,
    },
    {
      key: 'interval_probeg',
      title: 'Интервал до следующего ТО (по пробегу)',
      type: 'number',
      maxLength: 128,
      required: true,
      integer: true,
    },
    {
      key: 'measure_unit_run_id',
      title: 'Пробег измеряется',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'interval_time',
      title: 'Интервал до следующего ТО (по времени)',
      type: 'number',
      maxLength: 128,
      integer: true,
    },
    {
      key: 'interval_time_type',
      title: 'Время измеряется',
      type: 'valueOfArray',
    },
  ],
  dependencies: {
    sequence: [
      (value, { is_periodic }) => {
        if (!is_periodic && !value) {
          return getRequiredFieldMessage('Последовательность ТО');
        }

        return '';
      },
    ],
    measure_unit_run_id: [
      (_, { tech_maintenance_type_id }) => {
        if (!tech_maintenance_type_id) {
          return getRequiredFieldMessage('Тип ТО');
        }

        return '';
      },
    ],
  },
};
