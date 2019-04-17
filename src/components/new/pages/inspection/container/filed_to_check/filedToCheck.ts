import { FiledToCheck } from "components/new/pages/inspection/autobase/components/vsible_warning/@types/visibleWarning";

export const filedToCheckContainerFirst: FiledToCheck = [
  {
    key: 'number',
    title: 'Порядковый и/или инвентарный номер емкости',
    type: 'string',
  },
  {
    key: 'capacity',
    title: 'Вместимость (куб. м)',
    type: 'number',
  },
  {
    key: 'capacity_percent',
    title: 'Коэффициент заполнения на день проверки',
    type: 'number',
  },
  {
    key: 'pgm_marka',
    title: 'Марка ПГМ в емкости',
    type: 'string',
  },
  {
    key: 'pgm_volume',
    title: 'Объем ПГМ в емкости (тонн)',
    type: 'number',
  },
  {
    key: 'last_checked_at',
    title: 'Дата последней диагностики',
    type: 'date',
    time: false,
  },
  {
    key: 'diagnostic_result',
    title: 'Результат диагностики',
    type: 'string',
  },
];

export const filedToCheckContainerSecond: FiledToCheck = [
  {
    key: 'equipment_pipeline_in_poor_condition',
    title: 'Неуд. состояние оборудования и трубопровода',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'control_measuring_instruments_in_poor_condition',
    title: 'Неуд. состояние контрольно-измерительных приборов',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
];
