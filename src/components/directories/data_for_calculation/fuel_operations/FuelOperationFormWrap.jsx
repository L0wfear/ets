import React from 'react';
import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseFuelOperationForm from 'components/directories/data_for_calculation/fuel_operations/FuelOperationForm';

import { connect } from 'react-redux';
import {
  FuelOperationCreate,
  FuelOperationUpdate,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';
import {
  FUEL_RATES_SET_DATA,
} from 'redux-main/reducers/modules/fuel_rates/fuelRates';
import { compose } from 'recompose';

const FuelOperationForm = enhanceWithPermissions(BaseFuelOperationForm);


export const fuelOperationSchema = {
  properties: [
    {
      key: 'name',
      title: 'Операция',
      type: 'string',
      required: true,
    },
    {
      key: 'measure_unit_id',
      title: 'Единица измерения',
      type: 'number',
      required: true,
      integer: true,
    },
    {
      key: 'equipment',
      required: false,
    },
  ],
};

export class FuelOperationFormWrap extends FormWrap {
  constructor(props) {
    super(props);
    this.uniqueField = 'id';
    this.createAction = this.props.FuelOperationCreate;
    this.updateAction = this.props.FuelOperationUpdate;
    this.schema = fuelOperationSchema;
  }

  render() {
    const { showForm } = this.props;

    return showForm
      ? (
        <FuelOperationForm
          formState={this.state.formState}
          permissions={['fuel_operation.update']}
          addPermissionProp
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          measureUnitList={this.props.measureUnitList}
          {...this.state}
        />
      )
      : null;
  }
}
export default compose(
  connect(
    state => ({
      fuelRatesList: state.fuelRates.fuelRatesList,
      fuelRateOperations: state.fuelRates.fuelRateOperations,
    }),
    dispatch => ({
      FuelOperationCreate: payload => (
        dispatch(
          FuelOperationCreate(FUEL_RATES_SET_DATA, payload),
        )
      ),
      FuelOperationUpdate: payload => (
        dispatch(
          FuelOperationUpdate(FUEL_RATES_SET_DATA, payload),
        )
      ),
    }),
  ),
)(FuelOperationFormWrap);
