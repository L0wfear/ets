import * as React from 'react';
import { uniqBy } from 'lodash';

import useForm from "components/new/utils/context/form/hook_selectors/useForm";
import { WaybillFormStoreType } from "components/new/pages/waybill/form/context/@types";
import useEmployeeFullNameOptions from "components/new/utils/hooks/services/useOptions/useEmployeeFullNameOptions";
import { Waybill } from "redux-main/reducers/modules/waybill/@types";
import useMedicalStatsAllowedDriverList from "components/new/utils/hooks/services/useList/useMedicalStatsAllowedDriverList";
import waybillFilterDrivers from './waybill_filter_driver';
import useEmployeeBindedToCarApiList from 'components/new/utils/hooks/services/useList/useEmployeeBindedToCarList';

export const useWaybillDrivers = (formDataKey: string, car_id: Waybill['car_id'], plan_departure_date: Waybill['plan_departure_date'], plan_arrival_date: Waybill['plan_arrival_date'], company_id: Waybill['company_id'], gov_number: Waybill['gov_number'], structure_id: Waybill['structure_id']) => {
  const employeeBindedToCarListData = useForm.useFormDataLoadOptions<WaybillFormStoreType, 'employeeBindedToCar'>(
    formDataKey,
    'employeeBindedToCar',
    useEmployeeBindedToCarApiList(car_id),
  );

  const medicalStatsAllowedDriversListData = useForm.useFormDataLoadOptions<WaybillFormStoreType, 'medicalStatsAllowedDrivers'>(
    formDataKey,
    'medicalStatsAllowedDrivers',
    useMedicalStatsAllowedDriverList(company_id, plan_departure_date, plan_arrival_date),
  );

  const employeeListData = useForm.useFormDataLoadOptions<WaybillFormStoreType, 'employee'>(
    formDataKey,
    'employee',
    useEmployeeFullNameOptions(),
  );

  const driverOptions = React.useMemo(
    () => {
      let options = [];

      const isLoading = (
        employeeBindedToCarListData.isLoading
        || medicalStatsAllowedDriversListData.isLoading
        || employeeListData.isLoading
      );

      if (!isLoading) {
        if (employeeBindedToCarListData.list.length) {
          options = waybillFilterDrivers(
            uniqBy(employeeBindedToCarListData.list, 'employee_id'),
            medicalStatsAllowedDriversListData.list,
            employeeListData.listIndex,
            gov_number,
            car_id,
            structure_id,
          );
        }
      }

      return {
        options,
        isLoading,
      };
    },
    [
      employeeBindedToCarListData,
      medicalStatsAllowedDriversListData,
      employeeListData,
    ],
  );

  return driverOptions;
};
