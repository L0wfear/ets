// Модуль для функций, использующихся при рендеринге поля фильтра в гридах
// TODO переделать на нормальный i18n


// TODO убрать
export function getGeozoneTypeLabel(type) {
  return type === 'odh' ? 'Объект дорожного хозяйства' : 'Дворовая территория';
}

// TODO обращений к сторам быть не должно, нужно получать данные из бека
export const employeeFIOLabelFunction = flux => (employeeId, fullFlag = false) => {
  const employees = flux.getStore('employees').state.employeesList;
  const employee = employees.find(e => e.id === employeeId);

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

export const newEmployeeFIOLabelFunction = (employee, fullFlag = false) => {
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
