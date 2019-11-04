import * as React from 'react';

import UNSAFE_FormWrap from 'components/old/compositions/UNSAFE_FormWrap';
import ProgramRemarkForm from 'components/old/program_registry/UpdateFrom/inside_components/program_remark/ProgramRemarkForm';
import { formValidationSchema } from 'components/old/program_registry/UpdateFrom/inside_components/program_remark/schema';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

class ProgramRemarkFormWrap extends UNSAFE_FormWrap {
  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
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
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        isSupervisor={isSupervisor}
        isСustomer={isСustomer}
      />
    ) : null;
  }
}

export default withRequirePermission()(ProgramRemarkFormWrap);
