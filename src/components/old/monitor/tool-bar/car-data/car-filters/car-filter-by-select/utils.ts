import {
  CheckByIdAndNameFunc,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/CarFilterBySelect.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const checkByIdAndName: CheckByIdAndNameFunc  = ({ ...store }, id, name) => {
  if (id && name && !store.obj[id]) {
    store.obj[id] = name;
    store.arr.push({
      value: id,
      label: name,
    });
  }

  return store;
};

export const makeOptions = (carActualGpsNumberIndex: Record<string, Car>) => (
  Object.values(carActualGpsNumberIndex).reduce((newObj, { type_id, type_name, company_structure_id, company_structure_name, owner_id, owner_name, condition, condition_text, model_id, model_name }) => {
    return {
      ...newObj,
      carFilterMultyTypeOptions: checkByIdAndName(newObj.carFilterMultyTypeOptions, type_id, type_name),
      carFilterMultyTechConditionOptions: checkByIdAndName(newObj.carFilterMultyTechConditionOptions, condition, condition_text),
      carFilterMultyModelOptions: checkByIdAndName(newObj.carFilterMultyModelOptions, model_id, model_name),
      carFilterMultyStructureOptions: checkByIdAndName(newObj.carFilterMultyStructureOptions, company_structure_id, company_structure_name),
      carFilterMultyOwnerOptions: checkByIdAndName(newObj.carFilterMultyOwnerOptions, owner_id, owner_name),
    };
  }, {
    carFilterMultyTypeOptions: { obj: {}, arr: [] },
    carFilterMultyTechConditionOptions: { obj: {}, arr: [] },
    carFilterMultyModelOptions: { obj: {}, arr: [] },
    carFilterMultyStructureOptions: { obj: {}, arr: [] },
    carFilterMultyOwnerOptions: { obj: {}, arr: [] },
  })
);
