import { get } from 'lodash';

import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';

const createFio = (data: Pick<Employee, 'first_name' | 'last_name' | 'middle_name'>, full = false) => {
  const first_name = get(data, 'first_name', '');
  const last_name = get(data, 'last_name', '');
  const middle_name = get(data, 'middle_name', '');

  let result = '';
  if (last_name && last_name.length) {
    result += `${last_name} `;
  }
  if (first_name && first_name.length) {
    result += full || !(middle_name && middle_name.length) ? `${first_name} ` : `${first_name[0]}. `;
  }
  if (middle_name && middle_name.length) {
    result += full ? `${middle_name} ` : `${middle_name[0]}. `;
  }
  return result;
};

export default createFio;
