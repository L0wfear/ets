import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import { connectToStores, FluxContext } from 'utils/decorators';
import DataTableInput from 'components/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from './table-schema';

interface IPropsBatteryToVehicleBlock extends ISharedPropsDataTableInput, IExternalPropsDataTableInputWrapper{
  batteryId: number;
}

@connectToStores(['autobase'])
@FluxContext
class BatteryToVehicleBlock extends React.Component<IPropsBatteryToVehicleBlock, any> {
  componentDidMount() {
    this.context.flux.getActions('autobase').getAutobaseListByType('batteryAvailableCar', {
      battery_id: this.props.batteryId,
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

export default BatteryToVehicleBlock;
