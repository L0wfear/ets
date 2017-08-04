import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import RepairForm from './RepairForm';
import { formValidationSchema } from './schema';

class RepairFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);
    const { car_id = -1 } = props;

    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').repair.bind(null, 'post', car_id === -1 ? {} : { car_id });
    this.updateAction = context.flux.getActions('autobase').repair.bind(null, 'put', car_id === -1 ? {} : { car_id });
  }

  render() {
    const { entity, car_id = -1, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <RepairForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        cols={this.props.meta.cols}
        car_id={car_id}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        canSave={canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }
}

export default enhanceWithPermissions(RepairFormWrap);
