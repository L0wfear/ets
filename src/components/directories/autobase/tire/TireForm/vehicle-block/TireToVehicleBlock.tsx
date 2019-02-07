import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import DataTableInput from 'components/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/directories/autobase/tire/TireForm/vehicle-block/table-schema';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

interface IPropsTireToVehicleBlock extends ISharedPropsDataTableInput, IExternalPropsDataTableInputWrapper {
  tireId: number;
}

class TireToVehicleBlock extends React.Component<IPropsTireToVehicleBlock, any> {
  componentDidMount() {
    this.props.tireAvailableCarGetAndSetInStore({
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

export default connect<any, any, any, ReduxState>(
  (state) => ({
    tireAvailableCarList: getAutobaseState(state).tireAvailableCarList,
  }),
  (dispatch, { page, path }) => ({
    tireAvailableCarGetAndSetInStore: (payload) => (
      dispatch(
        autobaseActions.tireAvailableCarGetAndSetInStore(
          payload,
          { page, path },
        ),
      )
    ),
  }),
)(TireToVehicleBlock);
