// TODO обращений к сторам быть не должно, нужно получать данные из бека
export const employeeFIOLabelFunction = (flux) => (employeeId, fullFlag = false) => {
  const employees = flux.getStore('employees').state.employeesList;
  const employee = employees.find((e) => e.id === employeeId);
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
