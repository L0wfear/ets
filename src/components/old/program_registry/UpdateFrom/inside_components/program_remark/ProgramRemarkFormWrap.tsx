import * as React from 'react';

import UNSAFE_FormWrap from 'components/old/compositions/UNSAFE_FormWrap';
import ProgramRemarkForm from 'components/old/program_registry/UpdateFrom/inside_components/program_remark/ProgramRemarkForm';
import { formValidationSchema } from 'components/old/program_registry/UpdateFrom/inside_components/program_remark/schema';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { validate } from 'components/old/ui/form/new/validate';

type Props = {
  [k: string]: any;
};
type State = any;

class ProgramRemarkFormWrap extends UNSAFE_FormWrap<Props, State> {
  constructor(props, context) {
    super(props);
    this.preventDefaultNotification = true;

    this.updateAction = context.flux
      .getActions('repair')
      .programRemark.bind(null, 'put');
  }

  createAction = (formState) => {
    const { program_version_id } = this.props;

    const newFormState = {
      ...formState,
      program_version_id,
    };

    return this.context.flux
      .getActions('repair')
      .programRemark('post', newFormState);
  };

  handleFormStateChange = (field, e) => {
    const value
      = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    let { formErrors } = this.state;
    const { formState } = this.state;
    const newState: any = {};

    console.info('Form changed', field, value);  // eslint-disable-line
    formState[field] = value;

    formErrors = this.validate(formState);

    newState.canSave = Object.values(formErrors).reduce(
      (boolean, oneError) => boolean && !oneError,
      true,
    );

    newState.formState = formState;
    newState.formErrors = formErrors;

    this.setState(newState);

    return newState;
  };

  validate = (formState) => {
    return validate(
      formValidationSchema,
      formState,
      this.props,
      formState,
    );
  };

  render() {
    const {
      entity,
      isPermitted = false,
      isSupervisor,
      isСustomer,
    } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ? (
      <ProgramRemarkForm
        entity={entity}
        formState={this.state.formState}
        program_version_status={this.props.program_version_status}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        canSave={canSave}
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        isSupervisor={isSupervisor}
        isСustomer={isСustomer}
      />
    ) : null;
  }
}

export default withRequirePermission<any>()(ProgramRemarkFormWrap);
