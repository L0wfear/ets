import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/spare_part/form/vehicle-block/table-schema';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { spareAvailableCarGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/spare_available_car/actions';

type IPropsSpareToVehicleBlock = {
  spareId: number;
  errors: any;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const SpareToVehicleBlock: React.FC<IPropsSpareToVehicleBlock> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const spareAvailableCarList = etsUseSelector((state) => getAutobaseState(state).spareAvailableCarList);

    React.useEffect(
      () => {
        const payload: { spare_id?: number; } = {};
        if (props.spareId) {
          payload.spare_id = props.spareId;
        }

        dispatch(
          spareAvailableCarGetAndSetInStore(
            payload,
            props,
          ),
        );
      },
      [props.spareId],
    );

    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить ТС"
        removeButtonLable="Удалить ТС"
        stackOrder
        spareAvailableCarList={spareAvailableCarList}
        {...props}
      />
    );
  },
);

export default SpareToVehicleBlock;
