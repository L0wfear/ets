import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';
import { autobaseGetSetCar } from 'redux-main/reducers/modules/autobase/car/actions';
import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/tire/form/vehicle-block/table-schema';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type IPropsTireToVehicleBlock = {
  tireId: number;
  errors: any;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const TireToVehicleBlock: React.FC<IPropsTireToVehicleBlock> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const [tireAvailableCarList, settireAvailableCarList] = React.useState([]);
    const {page, path} = props;
    React.useEffect(
      () => {
        dispatch(autobaseGetSetCar({}, {page, path})).then(
          ({ data }) => (
            settireAvailableCarList(
              data.map(
                (rowData) => ({
                  value: rowData.asuods_id,
                  label: `${rowData.gov_number} [${rowData.garage_number || '-'}/${rowData.model_name || '-'}/${rowData.special_model_name || '-'}/${rowData.type_name || '-'}]`,
                  rowData,
                }),
              ),
            )
          ),
        );
      },
      [],
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
