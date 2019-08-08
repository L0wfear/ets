import {
  getStructureByCar,
  getStructureByUserStructure,
  getStructureAfterChageCar,
} from 'components/new/utils/context/form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_structure_and_accompanying_person/structure/getStructureAfterChageCar';

type CarData = Parameters<typeof getStructureAfterChageCar>[0];
type UserData = Parameters<typeof getStructureAfterChageCar>[2];
const carData1: CarData = {
  is_common: null,
  company_structure_id: null,
  company_structure_name: null,
};
const carData2: CarData = {
  is_common: false,
  company_structure_id: null,
  company_structure_name: null,
};
const carData3: CarData = {
  is_common: false,
  company_structure_id: 1,
  company_structure_name: 'hello',
};
const carData4: CarData = {
  is_common: true,
  company_structure_id: 1,
  company_structure_name: 'hello',
};
const carData5: CarData = {
  is_common: false,
  company_structure_id: 1,
  company_structure_name: null,
};
const carData6: CarData = {
  is_common: false,
  company_structure_id: 1,
  company_structure_name: null,
};
const userData1: UserData = {
  structure_id: null,
  structure_name: null,
};
const userData2: UserData = {
  structure_id: 1,
  structure_name: null,
};
const userData3: UserData = {
  structure_id: null,
  structure_name: 'asd',
};
const userData4: UserData = {
  structure_id: 1,
  structure_name: 'asd',
};

test('Получение данных по подразделению ТС', () => {
  expect(getStructureByCar(carData1)).toBeNull();
  expect(getStructureByCar(carData2)).toBeNull();
  expect(getStructureByCar(carData3)).toEqual({
    structure_id: carData3.company_structure_id,
    structure_name: carData3.company_structure_name,
  });
  expect(getStructureByCar(carData4)).toBeNull();
  expect(getStructureByCar(carData5)).toBeNull();
  expect(getStructureByCar(carData6)).toBeNull();
});

test('Получение данных по подразделению при общей ТС', () => {
  expect(getStructureByUserStructure(carData1, userData4)).toBeNull();
  expect(getStructureByUserStructure(carData4, userData1)).toBeNull();
  expect(getStructureByUserStructure(carData4, userData2)).toBeNull();
  expect(getStructureByUserStructure(carData4, userData3)).toBeNull();
  expect(getStructureByUserStructure(carData4, userData4)).toEqual({
    structure_id: userData4.structure_id,
    structure_name: userData4.structure_name,
  });
});

test('Проверка выборки подразделения после измнения ТС на ПЛ', () => {
  expect(getStructureAfterChageCar(carData1, carData1, userData1)).toBeNull();
  expect(getStructureAfterChageCar(null, carData1, userData1)).toBeNull();
  expect(getStructureAfterChageCar(carData3, null, userData1)).toEqual({
    structure_id: carData3.company_structure_id,
    structure_name: carData3.company_structure_name,
  });
  expect(getStructureAfterChageCar(carData4, null, userData4)).toEqual({
    structure_id: userData4.structure_id,
    structure_name: userData4.structure_name,
  });
});
