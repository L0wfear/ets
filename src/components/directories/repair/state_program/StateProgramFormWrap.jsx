import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import StateProgramForm from 'components/directories/repair/state_program/StateProgramForm';
import { formValidationSchema } from 'components/directories/repair/state_program/schema';

class StateProgramFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('repair').stateProgram.bind(null, 'post');
    this.updateAction = context.flux.getActions('repair').stateProgram.bind(null, 'put');
  }

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm
      ? (
        <StateProgramForm
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
      )
      : null;
  }
}

export default enhanceWithPermissions(StateProgramFormWrap);
