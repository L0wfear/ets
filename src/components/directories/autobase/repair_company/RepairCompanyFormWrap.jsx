import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import RepairCompanyForm from './RepairCompanyForm.jsx';
import { formValidationSchema } from './schema';

class RepairCompanyWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').repairCompany.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').repairCompany.bind(null, 'put');
  }

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <RepairCompanyForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
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

export default enhanceWithPermissions(RepairCompanyWrap);
