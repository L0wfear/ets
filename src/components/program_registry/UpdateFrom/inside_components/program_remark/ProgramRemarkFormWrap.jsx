import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import ProgramRemarkForm from './ProgramRemarkForm';
import { formValidationSchema } from './schema';

class ProgramRemarkFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.updateAction = context.flux.getActions('repair').programRemark.bind(null, 'put');
  }
  createAction = (formState) => {
    const {
      program_version_id,
    } = this.props;

    const newFormState = {
      ...formState,
      program_version_id,
    };

    return this.context.flux.getActions('repair').programRemark('post', newFormState);
  }

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <ProgramRemarkForm
        entity={entity}
        formState={this.state.formState}
        program_version_status={this.props.program_version_status}
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

export default enhanceWithPermissions(ProgramRemarkFormWrap);
