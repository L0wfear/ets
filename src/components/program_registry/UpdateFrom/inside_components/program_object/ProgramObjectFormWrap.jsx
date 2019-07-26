import React from 'react';

import UNSAFE_FormWrap from 'components/compositions/UNSAFE_FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import { validateField } from 'utils/validate/validateField';

import ProgramObjectFormDT from 'components/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectFormDT';
import ProgramObjectFormODH from 'components/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectFormODH';

import {
  formValidationSchema,
  elementsValidationSchema,
} from 'components/program_registry/UpdateFrom/inside_components/program_object/schema';

class ProgramObjectFormWrap extends UNSAFE_FormWrap {
  constructor(props) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;
  }

  createAction = (formState) =>
    this.context.flux.getActions('repair').programObject('post', formState);

  updateAction = (formState) =>
    this.context.flux.getActions('repair').programObject('put', formState);

  handleMultiChange = (fields) => {
    let formErrors = { ...this.state.formErrors };
    const formState = { ...this.state.formState };
    const newState = {};

    Object.entries(fields).forEach(([field, e]) => {
      const value
        = e !== undefined && e !== null && !!e.target ? e.target.value : e;
      console.info('Form changed', field, value);
      formState[field] = value;
    });

    formErrors = this.validate(formState, formErrors);

    newState.canSave = Object.values(formErrors).reduce(
      (boolean, oneError) => boolean && !oneError,
      true,
    );

    newState.formState = formState;
    newState.formErrors = formErrors;

    this.setState(newState);
  };

  validate(state, errors) {
    if (typeof this.schema === 'undefined') return errors;

    const schema = this.schema;
    const formState = { ...state };

    Object.keys(errors).forEach((key) => {
      if (key.includes('element')) {
        delete errors[key];
      }
    });

    let newFormErrors = schema.properties.reduce(
      (formErrors, prop) => {
        const { key } = prop;
        formErrors[key] = validateField(
          prop,
          formState[key],
          formState,
          this.schema,
        );
        return formErrors;
      },
      { ...errors },
    );

    newFormErrors = {
      ...newFormErrors,
      ...state.elements.reduce(
        (obj, el, i) => ({
          ...obj,
          ...elementsValidationSchema.properties.reduce((elErrors, prop) => {
            const { key } = prop;
            elErrors[`element_${i}_${key}`] = validateField(
              prop,
              el[key],
              el,
              elementsValidationSchema,
            );
            return elErrors;
          }, {}),
        }),
        {},
      ),
    };

    return newFormErrors;
  }

  updateObjectData = () => {
    this.props.updateObjectData().then((ans) => {
      const {
        formState: { id },
      } = this.state;

      const {
        data: {
          result: { rows: data },
        },
      } = ans;

      const { percent = 1, reviewed_at = 2 } = data.find((d) => d.id === id);

      this.handleMultiChange({
        percent,
        reviewed_at,
      });

      return ans;
    });
  };

  switchFormByType() {
    const {
      formState: { type_slug },
    } = this.state;

    let error = false;

    switch (type_slug) {
      case 'dt':
        return this.getFormDt();
      case 'odh':
        return this.getFormOdh();
      default:
        error = true;
    }
    if (error) {
      new Promise((res) => res()).then(() => {
        console.log('нет типа объекта'); // eslint-disable-line
        this.props.onFormHide();
      });
    }
    return <div />;
  }

  getFormDt() {
    const { entity, isPermitted = true } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return (
      <ProgramObjectFormDT
        prCompanyName={this.props.company_name}
        formState={this.state.formState}
        program_version_status={this.props.program_version_status}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        handleMultiChange={this.handleMultiChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        isPermitted={
          isPermitted && this.props.program_version_status !== 'accepted'
        }
        updateObjectData={this.updateObjectData}
        isPermittedByStatus={this.props.isPermittedByStatus}
        isPermittedPercentByStatus={this.props.isPermittedPercentByStatus}
        changeVersionWithObject={this.props.changeVersionWithObject}
        isPermittetForObjectFact={this.props.isPermittetForObjectFact}
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
        canSave={canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        handleMultiChange={this.handleMultiChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        isPermitted={
          isPermitted && this.props.program_version_status !== 'accepted'
        }
        updateObjectData={this.updateObjectData}
        isPermittedByStatus={this.props.isPermittedByStatus}
        isPermittedPercentByStatus={this.props.isPermittedPercentByStatus}
        isPermittetForObjectFact={this.props.isPermittetForObjectFact}
      />
    );
  }

  render() {
    return this.props.showForm ? this.switchFormByType() : null;
  }
}

export default enhanceWithPermissions(ProgramObjectFormWrap);
