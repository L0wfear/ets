import * as React from 'react';

import UNSAFE_FormWrap from 'components/old/compositions/UNSAFE_FormWrap';

import ProgramObjectFormDT from 'components/old/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectFormDT';

import {
  formValidationSchema,
  elementsValidationSchema,
} from 'components/old/program_registry/UpdateFrom/inside_components/program_object/schema';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { validate } from 'components/old/ui/form/new/validate';

type Props = {
  [k: string]: any;
};
type State = any;

class ProgramObjectFormWrap extends UNSAFE_FormWrap<Props, State> {
  preventDefaultNotification = true;

  createAction = (formState) =>
    this.context.flux.getActions('repair').programObject('post', formState);

  updateAction = (formState) =>
    this.context.flux.getActions('repair').programObject('put', formState);

  handleMultiChange = (fields) => {
    let formErrors = { ...this.state.formErrors };
    const formState = { ...this.state.formState };
    const newState: any = {};

    Object.entries(fields).forEach(([field, e]: any) => {
      const value
        = e !== undefined && e !== null && !!e.target ? e.target.value : e;
      console.info('Form changed', field, value);  // tslint:disable-line
      formState[field] = value;
    });

    formErrors = this.validate(formState);

    newState.canSave = Object.values(formErrors).reduce(
      (boolean, oneError) => boolean && !oneError,
      true,
    );

    newState.formState = formState;
    newState.formErrors = formErrors;

    this.setState(newState);
  };

  validate = (formState) => {
    let newFormErrors = validate(
      formValidationSchema,
      formState,
      this.props,
      formState,
    );

    newFormErrors = {
      ...newFormErrors,
      ...formState.elements.reduce(
        (obj, el, i) => ({
          ...obj,
          ...Object.entries(
            validate(
              elementsValidationSchema,
              el,
              this.props,
              el,
            ),
          ).reduce((newObj, [key, error]) => {
            newObj[`element_${i}_${key}`] = error;

            return newObj;
          }, {})
        }),
        {},
      ),
    };

    return newFormErrors;
  };

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
        console.info('нет типа объекта'); // tslint:disable-line
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
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        handleMultiChange={this.handleMultiChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        isPermittedByPermission={isPermitted}
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
    return <div>none</div>;
  }

  render() {
    return this.props.showForm ? this.switchFormByType() : null;
  }
}

export default withRequirePermission<any>()(ProgramObjectFormWrap);
