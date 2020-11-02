import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';
import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/local_registry/info/vehicle-block/table-schema';

import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';

type IPropsTachographToVehicleBlock = {
  errors: any;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const TachographToVehicleBlock: React.FC<IPropsTachographToVehicleBlock> = React.memo(
  (props) => {
    const {
      page,
      path,
    } = props;

    const carActualOptions = useCarActualOptions(page, path, { labelFunc: carActualOptionLabelGarage, });
    const carList = carActualOptions.options;
    const isLoading = carActualOptions.isLoading;

    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить ТС"
        removeButtonLable="Удалить ТС"
        stackOrder
        tachographAvailableCarList={carList}
        isLoading={isLoading}
        removeItemWithConfirm
        {...props}
      />
    );
  },
);

export default TachographToVehicleBlock;
