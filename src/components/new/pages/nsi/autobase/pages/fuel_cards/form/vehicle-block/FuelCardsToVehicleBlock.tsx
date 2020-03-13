import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/vehicle-block/table-schema';
import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';

type IPropsFuelCardsToVehicleBlock = {
  fuelCardsId: number;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const FuelCardsToVehicleBlock: React.FC<IPropsFuelCardsToVehicleBlock> = React.memo(
  (props) => {

    const fuelCardsAvailableCarList = useCarActualOptions(props.page, props.path, { labelFunc: carActualOptionLabelGarage, });
  
    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить ТС"
        removeButtonLable="Удалить ТС"
        stackOrder
        fuelCardsAvailableCarList={fuelCardsAvailableCarList}

        {...props}
      />
    );
  },
);

export default FuelCardsToVehicleBlock;
