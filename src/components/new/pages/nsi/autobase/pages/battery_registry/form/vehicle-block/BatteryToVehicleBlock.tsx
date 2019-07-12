import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import DataTableInput from 'components/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/vehicle-block/table-schema';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

interface IPropsBatteryToVehicleBlock extends ISharedPropsDataTableInput, IExternalPropsDataTableInputWrapper {
  batteryId: number;
}

class BatteryToVehicleBlock extends React.Component<IPropsBatteryToVehicleBlock, any> {
  componentDidMount() {
    this.props.batteryAvailableCarGetAndSetInStore(
      this.props.batteryId
        ? { battery_id: this.props.batteryId, }
        : {},
    );
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

export default connect<any, any, any, ReduxState>(
  (state) => ({
    batteryAvailableCarList: getAutobaseState(state).batteryAvailableCarList,
  }),
  (dispatch, { page, path }) => ({
    batteryAvailableCarGetAndSetInStore: (payload) => (
      dispatch(
        autobaseActions.batteryAvailableCarGetAndSetInStore(
          payload,
          { page, path },
        ),
      )
    ),
  }),
)(BatteryToVehicleBlock);
