import * as React from 'react';
import useEmployeeBindedToCarList from '../useList/useEmployeeBindedToCarList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import isPreferEmployee from 'components/new/utils/context/form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_driver_id/is_prefer_employee';
import { EmployeeBindedToCar } from 'components/new/utils/context/loading/@types/by_service/employee_binded_to_car';

const useEmployeeBindedToCarOptions = (car_id: Car['asuods_id'], page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useEmployeeBindedToCarList(car_id, page, path);

  const employeeBindedToCarOptions = React.useMemo(
    () => {
      const obj = listData.list.reduce<Record<EmployeeBindedToCar['asuods_id'], EmployeeBindedToCar>>(
        (newObj, rowData) => {
          if (!newObj[rowData.employee_id]) {
            newObj[rowData.employee_id] = rowData;
          } else if (isPreferEmployee(rowData.binding_type)) {
            newObj[rowData.employee_id] = rowData;
          }

          return newObj;
        },
        {},
      );

      return {
        options: Object.values(obj).map(
          (rowData) => ({
            value: rowData.employee_id,
            label: rowData.driver_fio,
            rowData,
          }),
        ),
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );

  return employeeBindedToCarOptions;
};

export default useEmployeeBindedToCarOptions;
