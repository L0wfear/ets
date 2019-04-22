import {
  VALUE_FOR_FIXED,
} from 'components/new/ui/mission_info_form/form-components/info-table-data/utils/constants';

export const checkFixed = (data, key) => {
  const clone = [...data];

  if (VALUE_FOR_FIXED[key].list.includes(data[1])) {
    clone[0] = parseFloat(clone[0]).toFixed(VALUE_FOR_FIXED[key].val);
  }

  return clone;
};

export const getDataTraveledYet = (data) => {
  if (data === null) {
    return 0;
  }
  if (Array.isArray(data)) {
    return data.join(' ');
  }

  return !isNaN(parseInt(data, 10)) ? parseInt(data, 10) : '-';
};

export const makeTitle = ({ mission_data, car_data }) => {
  const titleArr = [
    `Информация о задании №${mission_data.number}.`,
    `Рег. номер ТС: ${car_data.gov_number}`,
  ];
  if (mission_data.column_id) {
    titleArr.push('.');
    titleArr.push(`Колонна № ${mission_data.column_id}`);
  }

  return titleArr.join(' ');
};
