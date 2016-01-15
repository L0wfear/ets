import fakeData from '../../mocks/employees.js';

export function getEmployees() {
	return fakeData
}

export function getDriverByCode(code){
	let drivers = getDrivers();
	let result;
	_.each(drivers, (driver) => {
			if (driver['Табельный номер'] === code){
				result = driver
			}
	})
	return result;
}

export function getFIOById(id, fullFlag = false) {
	let result = [];

	_.each( fakeData, (v) => {
		if ( v.id === id) {
			result = v['Фамилия'] + ' '+ (fullFlag ?
				v['Имя']+' '+v['Отчество'] : v['Имя'][0]+'.'+v['Отчество'][0]+'.');
		}

	})
	return result;
}

export function getEmployeeById(id) {
	return _.find(fakeData, e => e.id === id);
}


export function getMasters() {
	const posts = [
		'заместитель директора по ОДХ и озеленению',
		'начальник автобазы',
		'начальник отдела',
		'заместитель начальника отдела',
		'мастер'
	];
	let result = [];

	_.each(fakeData, (v) =>{
			let post = v['Должность'].toLowerCase();
			if (posts.indexOf(post) > -1) {
				result.push(v)
			}
		}
		)

	console.log( 'список мастеров', result);
	return result;
}

export function getDrivers() {
	let result = [];

	_.each(fakeData, (v)=> {
		if (v['Должность'].toLowerCase() === 'водитель') {
			let _v = _.clone(v);
			_v.value = v['Табельный номер'];
			_v.label = '['+_v.value+']'+' '+v.label;
			result.push(_v);
		}
	})

	return result;
}

export function updateDriver(data) {
	let toSave = _.clone(data);
 	let updatedDriver = getEmployeeById(data.id);

 	_.each(toSave, (v,k ) => {
 		updatedDriver[k] = v;
 	})

 	//updatedBill.STATUS = false;

 	//sortList();
}
