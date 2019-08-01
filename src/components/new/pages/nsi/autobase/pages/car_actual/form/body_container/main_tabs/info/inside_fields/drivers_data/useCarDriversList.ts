import * as React from 'react';
import createFio from 'utils/create-fio';
import { filterDriver } from '../../../../../utils';
import { Employee, Driver } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { CarWrap } from '../../../../../@types/CarForm';
import { HandleThunkActionCreator } from 'react-redux';
import { employeeDriverGetSetDriver } from 'redux-main/reducers/modules/employee/driver/actions';
import { employeeEmployeeGetSetEmployee } from 'redux-main/reducers/modules/employee/employee/actions';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

type UseCarDriversListAns = {
  primaryDriverOptions: DefaultSelectOption<number, string, Employee>[],
  secondaryDriverOptions: DefaultSelectOption<number, string, Employee>[],
};
type UseCarDriversList = (
  drivers_data: CarWrap['drivers_data'],
  gov_number: CarWrap['gov_number'],
  page: string,
  path: string,
  employeePromise: HandleThunkActionCreator<typeof employeeEmployeeGetSetEmployee>,
  driverPromise: HandleThunkActionCreator<typeof employeeDriverGetSetDriver>,
) => UseCarDriversListAns;

const useCarDriversList: UseCarDriversList = (drivers_data, gov_number, page, path, employeePromise, driverPromise) => {
  const [employeeIndex, setEmployeeIndex] = React.useState<Record<Employee['id'], Employee>>({});
  const [driverList, setDriverList] = React.useState<Driver[]>([]);

  React.useEffect(
    () => {
      employeePromise({}, { page, path }).then(
        ({ payload: { dataIndex } }) => {
          setEmployeeIndex(dataIndex);
        },
      );
      driverPromise({}, { page, path }).then(
        ({ data }) => {
          setDriverList(data);
        },
      );
    },
    [],
  );

  const driverOptions = React.useMemo(
    () => {
      return driverList.filter(
        (driver) => {
          return filterDriver(
            employeeIndex[driver.id],
            gov_number,
          );
        },
      ).map(
        (driver) => ({
          value: driver.id,
          label: createFio(employeeIndex[driver.id]),
          rowData: employeeIndex[driver.id],
        }),
      );
    },
    [employeeIndex, driverList],
  );

  const primaryDriverOptions = React.useMemo(
    () => {
      const arr = driverOptions.filter(({ value }) => (
        !drivers_data.secondary_drivers.includes(value)
        || drivers_data.primary_drivers.includes(value)
      ));

      drivers_data.primary_drivers.forEach((id) => {
        if (!driverOptions.find(({ value }) => value === id)) {
          driverOptions.push({
            value: id,
            label: createFio(employeeIndex[id]),
            rowData: employeeIndex[id],
          });
        }
      });

      return arr;
    },
    [driverOptions, employeeIndex, drivers_data],
  );

  const secondaryDriverOptions = React.useMemo(
    () => {
      const arr = driverOptions.filter(({ value }) => (
        !drivers_data.primary_drivers.includes(value)
        || drivers_data.secondary_drivers.includes(value)
      ));

      drivers_data.secondary_drivers.forEach((id) => {
        if (!driverOptions.find(({ value }) => value === id)) {
          driverOptions.push({
            value: id,
            label: createFio(employeeIndex[id]),
            rowData: employeeIndex[id],
          });
        }
      });

      return arr;
    },
    [driverOptions, employeeIndex, drivers_data],
  );

  return {
    primaryDriverOptions,
    secondaryDriverOptions,
  };
};

export default useCarDriversList;
