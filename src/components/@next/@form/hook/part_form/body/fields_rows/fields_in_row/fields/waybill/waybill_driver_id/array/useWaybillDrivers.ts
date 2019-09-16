import * as React from 'react';
import { uniqBy } from 'lodash';

import useForm from "components/@next/@form/hook_selectors/useForm";
import { WaybillFormStoreType } from "components/new/pages/waybill/form/context/@types";
import useEmployeeFullNameOptions from "components/new/utils/hooks/services/useOptions/useEmployeeFullNameOptions";
import { Waybill } from "redux-main/reducers/modules/waybill/@types";
import useMedicalStatsAllowedDriverList from "components/new/utils/hooks/services/useList/useMedicalStatsAllowedDriverList";
import waybillFilterDrivers from './waybill_filter_driver';
import useEmployeeBindedToCarApiList from 'components/new/utils/hooks/services/useList/useEmployeeBindedToCarList';

export const useWaybillDrivers = (formDataKey: any) => {
  const car_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_id']>(formDataKey, 'car_id');
  const gov_number = useForm.useFormDataFormStatePickValue<Waybill, Waybill['gov_number']>(formDataKey, 'gov_number');
  const plan_departure_date = useForm.useFormDataFormStatePickValue<Waybill, Waybill['plan_departure_date']>(formDataKey, 'plan_departure_date');
  const plan_arrival_date = useForm.useFormDataFormStatePickValue<Waybill, Waybill['plan_arrival_date']>(formDataKey, 'plan_arrival_date');
  const company_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['company_id']>(formDataKey, 'company_id');
  const structure_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['structure_id']>(formDataKey, 'structure_id');
  const driver_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['driver_id']>(formDataKey, 'driver_id');
  const driver_fio = useForm.useFormDataFormStatePickValue<Waybill, Waybill['driver_fio']>(formDataKey, 'driver_fio');

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
            driver_id,
            driver_fio,
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
      gov_number,
      car_id,
      structure_id,
      driver_id,
      driver_fio,
    ],
  );

  return driverOptions;
};
