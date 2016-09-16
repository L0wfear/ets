import find from 'lodash/find';
// Модуль для функций, использующихся при рендеринге поля фильтра в гридах
// TODO переделать на нормальный i18n
let flux = null;
export function bindFlux(fluxInstance) {
  flux = fluxInstance;
}

export function waybillStatusLabelFunction(s) {
  switch (s) {
    case 'draft':
      return 'Черновик';
    case 'active':
      return 'Активен';
    case 'closed':
      return 'Закрыт';
    default:
      return 'Н/Д';
  }
}

export function waybillMissionsCompleteStatusLabelFunction(status) {
  return status === true ? 'Все задания завершены' : 'Есть незавершенные задания';
}

export function getReportStatusLabel(status) {
  switch (status) {
    case 'fail':
      return 'Ошибка';
    case 'success':
      return 'Обработан';
    case 'in progress':
      return 'В обработке';
    case 'wait':
      return 'В очереди';
    default:
      return 'Н/Д';
  }
}

export function getGeozoneTypeLabel(type) {
  return type === 'odh' ? 'Объект дорожного хозяйства' : 'Дворовая территория';
}

export function getPeriodicReportStatusLabel(s) {
  const statuses = {
    full_traveled: 'Пройдено полностью',
    not_traveled: 'Не пройдено',
    traveled_less_than_half: 'Пройдено меньше половины',
    traveled_more_than_half: 'Пройдено больше половины',
  };

  return statuses[s];
}

// TODO обращений к сторам быть не должно, нужно получать данные из бека
export function employeeFIOLabelFunction(employeeId, fullFlag = false) {
  const employees = flux.getStore('employees').state.employeesList;
  const employee = find(employees, e => e.id === employeeId);
  if (!employee) {
    return '';
  }
  let result = `${employee.last_name} `;
  result += fullFlag ? `${employee.first_name || ''} ${employee.middle_name || ''}` : `${employee.first_name[0] && employee.first_name[0] + '.' || ''} ${employee.middle_name[0] && employee.middle_name[0] + '.' || ''}`;

  return result;
}
