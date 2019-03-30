import { FiledToCheck } from "components/new/pages/inspection/autobase/components/vsible_warning/@types/visibleWarning";

export const filedToCheckContainerFirst: FiledToCheck = [
  {
    key: 'number',
    title: 'Порядковый и/или инвентарный номер емкости',
    type: 'string',
    sub: 20,
  },
  {
    key: 'capacity',
    title: 'Вместимость (куб. м)',
    type: 'number',
    sub: 20,
  },
  {
    key: 'capacity_percent',
    title: 'Коэффициент заполнения на день проверки',
    type: 'number',
    sub: 20,
  },
  {
    key: 'pgm_marka',
    title: 'Марка ПГМ',
    type: 'string',
    sub: 20,
  },
  {
    key: 'pgm_volume',
    title: 'Объем ПГМ (тонн)',
    type: 'number',
    sub: 20,
  },
  {
    key: 'last_checked_at',
    title: 'Дата последней диагностики',
    type: 'date',
    time: false,
    sub: 20,
  },
  {
    key: 'diagnostic_result',
    title: 'Результат диагностики',
    type: 'string',
    sub: 20,
  },
];

export const filedToCheckContainerSecond: FiledToCheck = [
  {
    key: 'equipment_pipeline_in_poor_condition',
    title: 'Неуд. состояние оборудования и трубопровода',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub: 20,
  },
  {
    key: 'control_measuring_instruments_in_poor_condition',
    title: 'Неуд. состояние контрольно-измерительных приборов',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub: 20,
  },
];
