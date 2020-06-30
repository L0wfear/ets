import * as React from 'react';

import { createFio } from 'utils/labelFunctions';
import { Employee, Driver } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { employeeDriverGetSetDriver } from 'redux-main/reducers/modules/employee/driver/actions';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import { filterDriver } from 'components/new/pages/nsi/autobase/pages/car_actual/form/utils';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { get } from 'lodash';

type UseCarDriversListAns = {
  primaryDriverOptions: Array<DefaultSelectOption<number, string, Employee>>;
  secondaryDriverOptions: Array<DefaultSelectOption<number, string, Employee>>;
};
type UseCarDriversList = (
  drivers_data: CarWrap['drivers_data'],
  gov_number: CarWrap['gov_number'],
  meta: LoadingMeta,
  employee_data: CarWrap['employee_data']
) => UseCarDriversListAns;

const useCarDriversList: UseCarDriversList = (drivers_data, gov_number, meta, employee_data) => {
  const [employeeIndex, setEmployeeIndex] = React.useState<Record<Employee['id'], Employee>>({});
  const [driverList, setDriverList] = React.useState<Array<Driver>>([]);

  const dispatch = etsUseDispatch();
  React.useEffect(
    () => {
      setEmployeeIndex(employee_data.dataIndex);
      dispatch(employeeDriverGetSetDriver({}, meta)).then(
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
            {
              includeNotActive: true,
              isValidOneOfLicense: (meta.type_id === 15), // Тип техники: "Компрессор"
            },
          );
        },
      ).map(
        (driver) => ({
          value: driver.id,
          label: createFio(employeeIndex[driver.id]),
          rowData: employeeIndex[driver.id],
          isNotVisible: !driver.active,
        }),
      );
    },
    [employeeIndex, driverList, meta.type_id, gov_number, ],
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
            isNotVisible: !get(employeeIndex[id], 'active'),
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
            isNotVisible: !get(employeeIndex[id], 'active'),
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
