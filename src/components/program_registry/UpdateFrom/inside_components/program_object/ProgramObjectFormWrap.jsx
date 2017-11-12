import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import ProgramObjectFormDT from './ProgramObjectFormDT';
import ProgramObjectFormODH from './ProgramObjectFormODH';
import { formValidationSchema } from './schema';

class ProgramObjectFormWrap extends FormWrap {

  constructor(props) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;
  }
  createAction = formState => this.context.flux.getActions('repair').programObject('post', formState);
  updateAction = formState => this.context.flux.getActions('repair').programObject('put', formState);

  getFormDt() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return (
      <ProgramObjectFormDT
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
    );
  }

  getFormOdh() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return (
      <ProgramObjectFormODH
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
    );
  }

  switchFormByType() {
    const {
      formState: {
        type_slug,
      } = {},
    } = this.state;

    let error = false;

    switch (type_slug) {
      case 'dt': return this.getFormDt();
      case 'odh': return this.getFormOdh();
      default: error = true;
    }
    if (error) {
      setTimeout(() => this.props.onFormHide(), 0);
      console.log('нет типа объекта');
    }
    return <div>as</div>;
  }

  render() {
    return this.props.showForm ?
      this.switchFormByType()
      : null;
  }
}

export default enhanceWithPermissions(ProgramObjectFormWrap);
