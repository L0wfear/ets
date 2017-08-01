import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import { connectToStores, FluxContext } from 'utils/decorators';
import DataTableInput from 'components/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from './table-schema';

interface IPropsTireToVehicleBlock extends ISharedPropsDataTableInput, IExternalPropsDataTableInputWrapper {
  tireId: number;
}

@connectToStores(['autobase'])
@FluxContext
class TireToVehicleBlock extends React.Component<IPropsTireToVehicleBlock, any> {
  componentDidMount() {
    this.context.flux.getActions('autobase').getAutobaseListByType('tireAvailibleCar', {
      tire_id: this.props.tireId,
    });
  }
  render() {
    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить ТС"
        removeButtonLable="Удалить ТС"
        stackOrder
        {...this.props}
      />
    );
  }
}

export default TireToVehicleBlock;
