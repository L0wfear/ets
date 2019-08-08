import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

type CarData = Pick<Car, 'is_common' | 'company_structure_id' | 'company_structure_name'> & Partial<Car>;
type UserData = Pick<InitialStateSession['userData'], 'structure_id' | 'structure_name'> & Partial<InitialStateSession['userData']>;

type StructureData = {
  structure_id: CompanyStructure['id'],
  structure_name: CompanyStructure['name'],
};

// тс не общая и пренадлежит подразделению
export const getStructureByCar = (selectedCarData: CarData): StructureData => {
  const carIsCommon = selectedCarData.is_common;
  const structureIdCar = selectedCarData.company_structure_id;
  const structureNameCar = selectedCarData.company_structure_name;

  if (structureIdCar && structureNameCar && !carIsCommon) {
    return ({
      structure_id: structureIdCar,
      structure_name: structureNameCar,
    });
  }

  return null;
};

// если тс общая
// и пользователь пренадлежит подразделению
export const getStructureByUserStructure = (selectedCarData: CarData, userData: UserData): StructureData => {
  const carIsCommon = selectedCarData.is_common;
  const structureIdCar = selectedCarData.company_structure_id;

  if (structureIdCar && carIsCommon && userData.structure_id && userData.structure_name) {
    return ({
      structure_id: userData.structure_id,
      structure_name: userData.structure_name,
    });
  }

  return null;
};

export const getStructureAfterChageCar = (selectedCarData: CarData, selectedCarDataPrev: CarData, userData: UserData): StructureData => {
  if (selectedCarData && (selectedCarData !== selectedCarDataPrev)) {
    const checkDataByCar = getStructureByCar(selectedCarData);

    if (checkDataByCar) {
      return checkDataByCar;
    }

    const checkDataByUser = getStructureByUserStructure(selectedCarData, userData);
    if (checkDataByUser) {
      return checkDataByUser;
    }
  }

  return null;
};
