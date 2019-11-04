import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/vehicle-block/table-schema';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type IPropsBatteryToVehicleBlock = {
  batteryId: number;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const BatteryToVehicleBlock: React.FC<IPropsBatteryToVehicleBlock> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const batteryAvailableCarList = etsUseSelector((state) => getAutobaseState(state).batteryAvailableCarList);

    React.useEffect(
      () => {
        const payload: { battery_id?: number; } = {};
        if (props.batteryId) {
          payload.battery_id = props.batteryId;
        }

        dispatch(
          autobaseActions.batteryAvailableCarGetAndSetInStore(
            payload,
            { page: props.page, path: props.path },
          ),
        );
      },
      [props.batteryId],
    );

    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить ТС"
        removeButtonLable="Удалить ТС"
        stackOrder
        batteryAvailableCarList={batteryAvailableCarList}
        {...props}
      />
    );
  },
);

export default BatteryToVehicleBlock;
