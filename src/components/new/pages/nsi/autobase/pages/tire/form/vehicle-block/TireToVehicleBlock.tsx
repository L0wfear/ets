import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/tire/form/vehicle-block/table-schema';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { tireAvailableCarGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/tire_available_car/actions';

interface IPropsTireToVehicleBlock extends ISharedPropsDataTableInput, IExternalPropsDataTableInputWrapper {
  tireId: number;
  errors: any;
}

const TireToVehicleBlock: React.FC<IPropsTireToVehicleBlock> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const tireAvailableCarList = etsUseSelector((state) => getAutobaseState(state).tireAvailableCarList);

    React.useEffect(
      () => {
        const payload: { tire_id?: number } = {};
        if (props.tireId) {
          payload.tire_id = props.tireId;
        }

        dispatch(
          tireAvailableCarGetAndSetInStore(
            payload,
            props,
          ),
        );
      },
      [props.tireId],
    );

    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить ТС"
        removeButtonLable="Удалить ТС"
        stackOrder
        tireAvailableCarList={tireAvailableCarList}
        {...props}
      />
    );
  },
);

export default TireToVehicleBlock;
