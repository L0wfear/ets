import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';

import DataTableInput from 'components/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/spare_part/form/vehicle-block/table-schema';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

interface IPropsSpareToVehicleBlock extends ISharedPropsDataTableInput, IExternalPropsDataTableInputWrapper {
  spareId: number;
  errors: any;
}

class SpareToVehicleBlock extends React.Component<IPropsSpareToVehicleBlock, any> {
  componentDidMount() {
    this.props.spareAvailableCarGetAndSetInStore(
      this.props.spareId
      ? {spare_id: this.props.spareId, }
      : {});
  }
  render() {
    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        errors={this.props.errors}
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
    spareAvailableCarList: getAutobaseState(state).spareAvailableCarList,
  }),
  (dispatch, { page, path }) => ({
    spareAvailableCarGetAndSetInStore: (payload) => (
      dispatch(
        autobaseActions.spareAvailableCarGetAndSetInStore(
          payload,
          { page, path },
        ),
      )
    ),
  }),
)(SpareToVehicleBlock);
