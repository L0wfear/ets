export const getFrontStatus = (statusId) => {
  switch (statusId) {
    case 1: return {
      slug: 'in_move',
    };
    case 2: return {
      slug: 'stop',
    };
    case 3: return {
      slug: 'parking',
    };
    default: return {
      slug: 'not_in_touch',
    };
  }
};

export const checkOnIncludesCar = (filterData, gps_code, { garage_number = '', gov_number = '' } = {}) => (
  gps_code && gps_code.toString().toLocaleLowerCase().includes(filterData.toString().toLocaleLowerCase())
  || gov_number && gov_number.toString().toLocaleLowerCase().includes(filterData.toString().toLocaleLowerCase())
  || garage_number && garage_number.toString().toLocaleLowerCase().includes(filterData.toString().toLocaleLowerCase())
);

export const checkFilterByKey = (key, value, gps_code, wsData, car_actualData) => {
  switch (key) {
    case 'carFilterText': return !value || checkOnIncludesCar(value, gps_code, car_actualData);
    case 'carFilterMultyType': return !value.length || value.includes(car_actualData.type_id);
    case 'carFilterMultyStructure': return !value.length || value.includes(car_actualData.company_structure_id);
    case 'carFilterMultyOwner': return !value.length || value.includes(car_actualData.owner_id);
    default: return false;
  }
};

export const checkOnVisible = ({ filters, statusShow, wsData, car_actualData}, gps_code) => (
  !!car_actualData
  && statusShow[getFrontStatus(wsData.status).slug]
  && !Object.entries(filters).some(([key, value]) => (
    !checkFilterByKey(
      key,
      value,
      gps_code,
      wsData,
      car_actualData,
    )
  ))
);
