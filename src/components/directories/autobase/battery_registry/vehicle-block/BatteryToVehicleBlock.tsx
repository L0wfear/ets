import * as React from 'react';

import { THOCPropsDataTableInput } from 'components/ui/table/@types/DataTableInputWrapper.h';

import { connectToStores, FluxContext } from 'utils/decorators';
import DataTableInput from 'components/ui/table/DataTableInput';
import { meta, renderers, validationSchema } from './table-schema';

interface IPropsBatteryToVehicleBlock extends THOCPropsDataTableInput {
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
