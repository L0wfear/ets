import * as React from 'react';
import { compose } from 'recompose';

import UNSAFE_FormWrap from 'components/old/compositions/UNSAFE_FormWrap';
import ProgramRegistryFormCreate from 'components/old/program_registry/CreateForm/ProgramRegistryFormC';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

const firstStepFields = [
  'state_program_id',
  'name',
  'repair_type_id',
  'plan_date_start',
  'plan_date_end',
];

type Props = {
  [k: string]: any;
};
type State = any;

class ProgramRegistryFormCreateWrap extends UNSAFE_FormWrap<Props, State> {
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
    this.props
      .defSendFromState(payload)
      .then(async ({ result: { rows: [createdPr] } }) => {
        this.props.setParams({
          program_registry_registry_id: createdPr.version_id,
        });

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
  };

  validate = (state) => this.props.validate(state);

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true, formErrors } = this.state;

    const stateCanSave = Object.entries(formErrors).reduce(
      (boolean, [key, oneError]) => {
        if (firstStepFields.includes(key)) {
          return boolean && !oneError;
        }
        return boolean;
      },
      true,
    );

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
        onHide={this.props.handleHide}
      />
    );
  }
}

export default compose(
  withRequirePermission(),
  withSearch,
)(ProgramRegistryFormCreateWrap);
