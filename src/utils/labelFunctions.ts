import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';

// TODO обращений к сторам быть не должно, нужно получать данные из бека
export const employeeFIOLabelFunction = (employeeIndex: Record<Employee['id'], Employee>, employeeId: Employee['id'], fullFlag = false) => {
  const employee = employeeIndex[employeeId];
  if (!employee) {
    return '';
  }

  let result = `${employee.last_name} `;

  if (fullFlag) {
    result = `${result}${employee.first_name || ''} ${employee.middle_name || ''}`;
  } else {
    if (employee.first_name && employee.first_name[0]) {
      result = `${result}${employee.first_name[0]}.`;
    }
    if (employee.middle_name && employee.middle_name[0]) {
      result = `${result}${employee.middle_name[0]}.`;
    }
  }

  return result;
};
