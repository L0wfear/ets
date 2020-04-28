import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/vehicle-block/table-schema';
import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';
import { FuelCardOnCars } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { get } from 'lodash';

type IPropsFuelCardsToVehicleBlock = {
  fuelCardsId: number;
  isPermittedToUpdateCards: boolean;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const FuelCardsToVehicleBlock: React.FC<IPropsFuelCardsToVehicleBlock> = React.memo(
  (props) => {

    const buttonsDisable = React.useCallback((selectedField: FuelCardOnCars) => {
      const removeButtonDisable = get(selectedField, 'is_used_in_waybill', false ) && !props.isPermittedToUpdateCards;

      return selectedField
        ? {
          addButtonDisable: false,
          removeButtonDisable,
        }
        : {
          addButtonDisable: false,
          removeButtonDisable: false,
        };
    }, [props.isPermittedToUpdateCards]);

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
        buttonsDisable={buttonsDisable}

        {...props}
      />
    );
  },
);

export default FuelCardsToVehicleBlock;
