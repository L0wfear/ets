import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { getRequiredFieldMessage } from 'utils/validate';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'tech_maintenance_type_id',
      title: 'Тип ТО',
      type: 'number',
      required: true,
    },
    {
      key: 'sequence',
      title: 'Последовательность ТО',
      type: 'number',
      isSubmitted: ({ is_periodic = false }) => !is_periodic,
    },
    {
      key: 'description',
      title: 'Описание',
      type: 'string',
      maxLength: 2048,
      required: true,
    },
    {
      key: 'car_model_id',
      title: 'Модель ТС',
      type: 'number',
      required: true,
    },
    {
      key: 'is_periodic',
      title: 'Признак периодического ТО',
      type: 'boolean',
      required: false,
    },
    {
      key: 'interval_km',
      title: 'Интервал до следующего ТО (по пробегу)',
      type: 'number',
      max: 128,
      required: true,
      integer: true,
    },
    {
      key: 'measure_unit_run_id',
      title: 'Пробег измеряется',
      type: 'number',
      required: true,
    },
    {
      key: 'interval_time',
      title: 'Интервал до следующего ТО (по времени)',
      type: 'number',
      max: 128,
      integer: true,
    },
    {
      key: 'interval_time_type',
      title: 'Время измеряется',
      type: 'string',
      isSubmitted: ({ interval_time_type = '' }) => !(interval_time_type === ''),
    },
  ],
  dependencies: {
    sequence: [
      {
        validator(value = '', { is_periodic = false }) {
          if (!is_periodic && !value) {
            return getRequiredFieldMessage('Последовательность ТО');
          }

          return '';
        },
      },
    ],
  },
};
