// Модуль для функций, использующихся при рендеринге поля фильтра в гридах
// TODO переделать на нормальный i18n
import { getFormattedDateTime } from 'utils/dates';

export function dateLabelFunction(date) {
  return getFormattedDateTime(date);
}

export function datePickerFunction(date) {
  return date;
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
  let result = '';

  switch (status) {
    case 'fail':
      result = 'Ошибка';
      break;
    case 'success':
      result = 'Обработан';
      break;
    case 'in progress':
      result = 'В обработке';
      break;
    case 'wait':
      result = 'В очереди';
      break;
  }

  return result;
};

export function getGeozoneTypeLabel(type) {
  return type === 'odh' ? 'Объект дорожного хозяйства' : 'Дворовая территория';
}

export function getPeriodicReportStatusLabel(s) {
  let statuses = {
    'full_traveled': 'Пройдено полностью',
    'not_traveled': 'Не пройдено',
    'traveled_less_than_half': 'Пройдено меньше половины',
    'traveled_more_than_half': 'Пройдено больше половины'
  }

  return statuses[s];
}

// TODO обращений к сторам быть не должно, нужно получать данные из бека
export function employeeFIOLabelFunction(employeeId, fullFlag = false) {
	const { flux } = window.__ETS_CONTAINER__;
  const employeesStore = flux.getStore('employees');
	const employee = employeesStore.getEmployeeById(employeeId);
  if (!employee) return '';
  let result = employee.last_name + ' ';
	result += fullFlag ? `${employee.first_name || ''} ${employee.middle_name || ''}` : `${employee.first_name[0] && employee.first_name[0]+'.' || ''} ${employee.middle_name[0] && employee.middle_name[0]+'.' || ''}`;

	return result;
}

export function getCarByIdLabelFunction(id) {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
	const car = objectsStore.getCarById(id);
	if (car.gov_number && car.model) {
		car.label = car.gov_number + ' [' + car.model + ']';
	}
	return car;
};

export function getModelById(id) {
  return window.__ETS_CONTAINER__.flux.getStore('objects').getModelById(id);
}

export function getTypeById(id) {
  return window.__ETS_CONTAINER__.flux.getStore('objects').getTypeById(id);
}

export function getFuelOperationById(id) {
  const { flux } = window.__ETS_CONTAINER__;
  return flux.getStore('fuelRates').getFuelOperationById(id);
}
