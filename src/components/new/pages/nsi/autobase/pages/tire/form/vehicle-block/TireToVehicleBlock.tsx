import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';
import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/tire/form/vehicle-block/table-schema';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { tireAvailableCarGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/tire_available_car/actions';
import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';

type IPropsTireToVehicleBlock = {
  tireId: number;
  errors: any;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const TireToVehicleBlock: React.FC<IPropsTireToVehicleBlock> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const tireAvailableCarList = etsUseSelector((state) => getAutobaseState(state).tireAvailableCarList);
    const carActualOptions = useCarActualOptions(props.page, props.path, { labelFunc: carActualOptionLabelGarage, });
    const carList = carActualOptions.options;
    const isLoading = carActualOptions.isLoading;

    React.useEffect(
      () => {
        const payload: { tire_id?: number; } = {};
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
    
    const carListOptions = React.useMemo(() => {
      if (carList.length && tireAvailableCarList.length) {
        return tireAvailableCarList.map((el) => carList.find((elem) => el.car_id === elem.value) || {...el, label: carActualOptionLabelGarage({gov_number: el.gov_number})});
      }
      return [];
    }, [carList, tireAvailableCarList]);

    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить ТС"
        removeButtonLable="Удалить ТС"
        stackOrder
        tireAvailableCarList={carListOptions}
        isLoading={isLoading}
        {...props}
      />
    );
  },
);

export default TireToVehicleBlock;
