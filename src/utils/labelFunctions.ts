import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';

export const createFio = (data: Pick<Employee, 'first_name' | 'last_name' | 'middle_name'>, full = false) => {
  const first_name = data?.first_name;
  const last_name = data?.last_name;
  const middle_name = data?.middle_name;

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

// TODO обращений к сторам быть не должно, нужно получать данные из бека
export const employeeFIOLabelFunction = (employeeIndex: Record<Employee['id'], Employee>, employeeId: Employee['id'], fullFlag = false) => {
  const employee = employeeIndex[employeeId];

  return createFio(employee, fullFlag);
};

