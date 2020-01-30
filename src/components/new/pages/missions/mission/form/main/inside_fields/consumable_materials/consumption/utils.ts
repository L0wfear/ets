import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';
import { isNumber } from 'util';

export const calculateCunsumption = ({rowData, fact_value, consumption, norm_value, }: { rowData: ConsumableMaterialCountMission; fact_value: number; consumption: number; norm_value: number; }) => {
	let consumptionRes = consumption;
	const fact_value_like_number = Number(fact_value);
	const norm_value_like_number = isNumber(norm_value)
		? norm_value
		: Number(norm_value);
	if (rowData.is_consumption_locked && isNumber(norm_value_like_number) && !isNaN(fact_value_like_number)) {
		consumptionRes = Number((fact_value_like_number * norm_value_like_number).toFixed(3));
	}
	return consumptionRes;
};
