import { createValidDate, diffDates } from 'components/@next/@utils/dates/dates';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
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
      min: 0,
      integer: true,
    },
    capacity_percent: {
      title: 'Коэффициент заполнения на день проверки',
      type: 'number',
      required: true,
      min: 0,
      integer: true,
    },
    pgm_marka: {
      title: 'Марка ПГМ в емкости',
      type: 'string',
      required: true,
    },
    pgm_volume: {
      title: 'Объем ПГМ в емкости (куб.м)',
      type: 'number',
      required: true,
      min: 0,
      integer: true,
      dependencies: [
        (value, {capacity}) => {
          if (+value > +capacity) {
            return 'Объем ПГМ в емкости не может быть больше вместимости емкости';
          }
        }
      ]
    },
    last_checked_at: {
      title: 'Дата последней диагностики',
      type: 'date',
      dependencies: [
        (value, {dataForValidation}) => {
          const date = createValidDate(value);
          if (
              dataForValidation?.current_date 
              && diffDates(date, dataForValidation?.current_date) > 0
          ) {
            return 'Дата последней диагностики не может быть больше текущей';
          }
        }
      ]
    },
    diagnostic_result: {
      title: 'Результат диагностики',
      type: 'string',
    },
  },
};
