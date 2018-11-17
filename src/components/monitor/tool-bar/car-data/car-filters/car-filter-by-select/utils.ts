import {
  CheckByIdAndNameFunc,
  MakeOptionsFunc,
} from 'components/monitor/tool-bar/car-data/car-filters/car-filter-by-select/CarFilterBySelect.h';

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

export const makeOptions: MakeOptionsFunc = (carActualGpsNumberIndex) => (
  Object.values(carActualGpsNumberIndex).reduce((newObj, { type_id, type_name, company_structure_id, company_structure_name, owner_id, owner_name }) => {
    return {
      ...newObj,
      carFilterMultyTypeOptions: checkByIdAndName(newObj.carFilterMultyTypeOptions, type_id, type_name),
      carFilterMultyStructureOptions: checkByIdAndName(newObj.carFilterMultyStructureOptions, company_structure_id, company_structure_name),
      carFilterMultyOwnerOptions: checkByIdAndName(newObj.carFilterMultyOwnerOptions, owner_id, owner_name),
    };
  }, {
    carFilterMultyTypeOptions: { obj: {}, arr: [] },
    carFilterMultyStructureOptions: { obj: {}, arr: [] },
    carFilterMultyOwnerOptions: { obj: {}, arr: [] },
  })
);
