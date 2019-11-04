import { EmployeeBindedToCar } from 'components/new/utils/context/loading/@types/by_service/employee_binded_to_car';
import { MedicalStatsAllowedDriver } from 'components/new/utils/context/loading/@types/by_service/medical_stats_allowed_drivers';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import memoizeOne from 'memoize-one';
import { CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { hasMotohours } from 'utils/functions';
import { diffDates } from 'components/@next/@utils/dates/dates';

const makeEmployeeList = (
  employeeBindedToCarList: Array<EmployeeBindedToCar>,
  medicalStatsAllowedDriversListData: Array<MedicalStatsAllowedDriver>,
  employeeIndexData: Record<Employee['id'], Employee>,
) => {
  return (
    employeeBindedToCarList.length
      ? employeeBindedToCarList.map(({ employee_id }) => employeeIndexData[employee_id])
      : medicalStatsAllowedDriversListData.map(({ id }) => employeeIndexData[id])
  ).filter((v) => !!v);
};

const validateEmployeeByStructureId = (structure_id: CompanyStructureLinear['id'], employeeDataPartial: Pick<Employee, 'is_common' | 'company_structure_id'>) => (
  !structure_id
  || employeeDataPartial.is_common
  || employeeDataPartial.company_structure_id === structure_id
);

export const driverHasLicenseWithActiveDate = (
  drivers_license: Employee['drivers_license'],
  drivers_license_date_end: Employee['drivers_license_date_end'],
) => (
  !drivers_license && !drivers_license_date_end
  || (
    drivers_license_date_end
    && diffDates(new Date(), drivers_license_date_end) < 0
  )
);

export const driverHasSpecialLicenseWithActiveDate = (
  special_license: Employee['special_license'],
  special_license_date_end: Employee['special_license_date_end'],
) => (
  special_license && !special_license_date_end
  || (
    special_license_date_end
    && diffDates(new Date(), special_license_date_end) < 0
  )
);

const validateEmployeeByLicense = (gov_number: Car['gov_number'], employeeData: Pick<Employee, 'special_license' | 'special_license_date_end' | 'drivers_license' | 'drivers_license_date_end'>) => {
  if (!hasMotohours(gov_number)) {
    return driverHasLicenseWithActiveDate(employeeData.drivers_license, employeeData.drivers_license_date_end);
  }
  return driverHasSpecialLicenseWithActiveDate(employeeData.special_license, employeeData.special_license_date_end);
};

const waybillFilterDrivers = memoizeOne(
  (
    employeeBindedToCarList: Array<EmployeeBindedToCar>,
    medicalStatsAllowedDriversListData: Array<MedicalStatsAllowedDriver>,
    employeeIndexData: Record<Employee['id'], Employee>,
    gov_number: string,
    car_id: number,
    structure_id: number,
    driver_id?: number,
    driver_name?: string,
  ) => {
    const initialList = makeEmployeeList(
      employeeBindedToCarList,
      medicalStatsAllowedDriversListData,
      employeeIndexData,
    );

    const driverWithSelectedCar = initialList.reduce<Array<Employee>>(
      (newArr, employeeData) => {
        if (employeeData.prefer_car || employeeData.secondary_car_text) {
          if (
            employeeData.prefer_car === car_id
            || employeeData.secondary_car.includes(car_id)
          ) {
            newArr.push(employeeData);
          }
        } else {
          newArr.push(employeeData);
        }
        return newArr;
      },
      [],
    );

    const options = (
      driverWithSelectedCar.length
        ? driverWithSelectedCar
        : initialList
    ).reduce(
      (newArr, employeeData) => {
        const validateByStructure = validateEmployeeByStructureId(structure_id, employeeData);
        const validateByLicense = validateEmployeeByLicense(gov_number, employeeData);

        if (validateByStructure && validateByLicense) {
          const personnel_number = (
            employeeData.personnel_number
              ? `[${employeeData.personnel_number}] `
              : ''
          );

          newArr.push({
            value: employeeData.id,
            label: `${
              personnel_number
            }${
              employeeData.last_name || ''} ${
              employeeData.first_name || ''
            } ${
              employeeData.middle_name || ''
            }`,
            rowData: {
              ...employeeData,
              isPrefer: employeeData.prefer_car === car_id,
            },
          });
        }

        return newArr;
      },
      [],
    );

    if (driver_id && driver_name && !options.find(({ rowData }) => rowData.id === driver_id )) {
      options.push({
        value: driver_id,
        label: driver_name,
        rowData: {},
      });
    }

    return options;
  },
);

export default waybillFilterDrivers;
