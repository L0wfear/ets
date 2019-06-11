import * as React from 'react';

import { ExtField } from 'components/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { defaultSortingFunction } from 'components/ui/input/ReactSelect/utils';
import { useWaybillDrivers } from './useWaybillDrivers';

type FieldWaybillDriverIdArrayProps = {
  formDataKey: string;
  md?: number;
};

const sortingDrivers = (a, b) => {
  const isPreverA = a.rowData.isPrefer;
  const isPreverB = b.rowData.isPrefer;

  if (isPreverA === isPreverB) {
    return defaultSortingFunction(a, b);
  }

  return isPreverB > isPreverA ? 1 : -1;
};

const FieldWaybillDriverIdArray: React.FC<FieldWaybillDriverIdArrayProps> = React.memo(
  (props) => {
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const {
      driver_id: value,
      car_id,
      gov_number,
      plan_departure_date,
      plan_arrival_date,
      company_id,
      structure_id,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const {
      driver_id: error,
    } = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);

    const employeeBindedToCarOptionData = useWaybillDrivers(
      props.formDataKey,
      car_id,
      plan_departure_date,
      plan_arrival_date,
      company_id,
      gov_number,
      structure_id,
    );

    const notSelectedCarId = !car_id;

    const handleChangeWrap = React.useCallback(
      (keyName, valueNew, option) => {
        handleChange({
          [keyName]: valueNew,
        });
      },
      [],
    );

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.md || 12}>
            <ExtField
              id="driver-id"
              type="select"
              placeholder={notSelectedCarId ? 'Выберите Транспортное средство' : undefined}
              label={'Водитель (возможен поиск по табельному номеру)'}
              error={error}
              sortingFunction={sortingDrivers}
              options={employeeBindedToCarOptionData.options}
              value={value}
              onChange={handleChangeWrap}
              boundKeys="driver_id"
              disabled={!isPermitted || notSelectedCarId}
              etsIsLoading={!notSelectedCarId && employeeBindedToCarOptionData.isLoading}
            />
          </EtsBootstrap.Col>
        );
      },
      [
        props,
        sortingDrivers,
        error,
        value,
        handleChangeWrap,
        isPermitted,
        notSelectedCarId,
        employeeBindedToCarOptionData,
      ],
    );
  },
);

export default FieldWaybillDriverIdArray;
