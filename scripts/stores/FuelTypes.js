const LIST = [
{
	id:1,
	label: 'Бензин',
	value: 1
},
{
	id:2,
	label: 'Д/т',
	value: 2
}];

export function getFuelTypeById (id) {
	let result = null;
	_.each(LIST, type => {
		if (type.id === id ) {
			result = type
		}
	})

	return result;
}

export default function getFuelTypes() {
	return LIST 
}