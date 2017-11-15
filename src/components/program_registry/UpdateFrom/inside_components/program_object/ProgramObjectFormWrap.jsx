import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import { validateField } from 'utils/validate/validateField.js';

import ProgramObjectFormDT from './ProgramObjectFormDT';
import ProgramObjectFormODH from './ProgramObjectFormODH';
import { formValidationSchema, elementsValidationSchema } from './schema';

class ProgramObjectFormWrap extends FormWrap {

  constructor(props) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;
  }
  createAction = formState => this.context.flux.getActions('repair').programObject('post', formState);
  updateAction = formState => this.context.flux.getActions('repair').programObject('put', formState);

  handleMultiChange = (fields) => {
    let formErrors = { ...this.state.formErrors };
    const formState = { ...this.state.formState };
    const newState = {};

    Object.entries(fields).forEach(([field, e]) => {
      const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
      console.info('Form changed', field, value);
      formState[field] = value;
    });

    formErrors = this.validate(formState, formErrors);

    newState.canSave = Object.values(formErrors).reduce((boolean, oneError) => boolean && !oneError, true);

    newState.formState = formState;
    newState.formErrors = formErrors;

    this.setState(newState);
  }

  validate(state, errors) {
    if (typeof this.schema === 'undefined') return errors;

    const schema = this.schema;
    const formState = { ...state };

    let newFormErrors = schema.properties.reduce((formErrors, prop) => {
      const { key } = prop;
      formErrors[key] = validateField(prop, formState[key], formState, this.schema);
      return formErrors;
    },
      { ...errors },
    );

    newFormErrors = {
      ...newFormErrors,
      ...state.elements.reduce((obj, el, i) => {
        obj = {
          ...elementsValidationSchema.properties.reduce((elErrors, prop) => {
            const { key } = prop;
            elErrors[`element_${i}_${key}`] = validateField(prop, el[key], el, elementsValidationSchema);
            return elErrors;
          }, {}),
        };
        return obj;
      }, {}),
    };

    return newFormErrors;
  }

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
        handleMultiChange={this.handleMultiChange}
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
