import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';

const odhPropertiesOptions = [
  { label: 'Общая площадь (кв.м.)', value: 'total_area' },
  { label: 'Протяженность (п.м.)', value: 'distance' },
  { label: 'Площадь проезжей части (кв.м.)', value: 'roadway_area' },
  { label: 'Площадь тротуаров (кв.м.)', value: 'footway_area' },
  { label: 'Площадь уборки (кв.м.)', value: 'cleaning_area' },
  {
    label: 'Площадь механизированной уборки тротуаров (кв.м.)',
    value: 'auto_footway_area',
  },
  {
    label: 'Площадь ручной уборки тротуаров (кв.м.)',
    value: 'manual_footway_area',
  },
  { label: 'Площадь уборки снега (кв.м.)', value: 'snow_area' },
  { label: 'Протяженность лотков (п.м.)', value: 'gutters_length' },
  {
    label: 'Кол-во убираемых остановок (ед.)',
    value: 'station_number',
  },
];

const dtPropertiesOptions = [
  { label: 'Общая площадь (кв.м.)', value: 'total_area' },
  { label: 'Общая уборочная площадь (кв.м.)', value: 'clean_area' },
  {
    label: 'Площадь механизированной уборки (кв.м.)',
    value: 'mechanical_clean_area',
  },
];

export const getCleaningRateProperties = (type: CleaningRate['type']) => {
  return (
    type === 'odh'
      ? odhPropertiesOptions
      : dtPropertiesOptions
    );
};
