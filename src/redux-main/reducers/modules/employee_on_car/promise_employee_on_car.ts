import { EmployeeOnCar } from "./@types/employeeOnCar";
import { cloneDeep } from 'lodash';

const BINDING_TYPE_TEXT = {
  primary: 'Основное',
  secondary: 'Вторичное',
};

export const getFrontEmployeeOnCar = (employeeOnCarOwn: EmployeeOnCar, index: number) => {
  const employeeOnCar: EmployeeOnCar = cloneDeep(employeeOnCarOwn);

  employeeOnCar.frontId = index + 1;
  employeeOnCar.binding_type_text = BINDING_TYPE_TEXT[employeeOnCar.binding_type] || '';

  return employeeOnCar;
};

export const getBackEmployeeOnCar = (employeeOnCarOwn: EmployeeOnCar) => {
  const employeeOnCar = cloneDeep(employeeOnCarOwn);

  delete employeeOnCar.frontId;
  delete employeeOnCar.binding_type_text;

  return employeeOnCar;
};
