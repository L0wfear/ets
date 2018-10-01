import * as React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import ProgramRegistryFormCreate from 'components/program_registry/CreateForm/ProgramRegistryFormC';

const firstStepFields = [
  'state_program_id',
  'name',
  'repair_type_id',
  'plan_date_start',
  'plan_date_end',
];

class ProgramRegistryFormCreateWrap extends FormWrap {
  componentDidMount() {
    this.state = {
      ...this.state,
      ...this.props.getFrowmStateAndErrorAndCanSave(this.props.element),
    };
  }

  handleSubmitFirstForm = () => {
    this.setState({
      saveButtonLabel: 'Сохранение...',
      saveButtonEnability: false,
    });

    const payload = {
      callback: this.context.flux.getActions('repair').programRegistryPost,
      outFormState: { ...this.state.formState },
    };
    this.props.defSendFromState(payload).then(({ result: { rows: [createdPr] } }) => {
      this.props.setNewSelectedElement(createdPr);

      this.setState({
        saveButtonLabel: 'Сохранить',
        saveButtonEnability: true,
      });
    })
      .catch(() => {
        this.setState({
          saveButtonLabel: 'Сохранить',
          saveButtonEnability: true,
        });
      });
  }

  validate = (state, errors) => this.props.validate(state, errors);

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true, formErrors } = this.state;

    const stateCanSave = Object.entries(formErrors).reduce((boolean, [key, oneError]) => {
      if (firstStepFields.includes(key)) {
        return boolean && !oneError;
      }
      return boolean;
    }, true);

    const canSave = isPermitted && stateCanSave && saveButtonEnability;

    return (
      <ProgramRegistryFormCreate
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        canSave={canSave}
        onSubmit={this.handleSubmitFirstForm}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
    );
  }
}

export default enhanceWithPermissions(ProgramRegistryFormCreateWrap);
