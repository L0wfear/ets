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
