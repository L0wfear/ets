// Модуль для функций, использующихся при рендеринге поля фильтра в гридах
import { getFormattedDateTime } from 'utils/dates';

export function dateLabelFunction(date) {
  return getFormattedDateTime(date);
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


// обращений к сторам быть не должно, нужно получать данные из бека
export function employeeFIOLabelFunction(employeeId) {
	let result = '';
	const { flux } = window.__ETS_CONTAINER__;
  const employeesStore = flux.getStore('employees');
	const employee = employeesStore.getEmployeeById(employeeId);
	if (employee) {
		if (employee.last_name && employee.first_name && employee.middle_name)
		result = employee.last_name + ' ' + employee.first_name[0]+ '.' + employee.middle_name[0] + '.';
	}

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
