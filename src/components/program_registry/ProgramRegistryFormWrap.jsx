import React from 'react';
import { omit } from 'lodash';

import { isEmpty } from 'utils/functions';
import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import ProgramRegistryFormCreate from './ProgramRegistryFormCreate';
import ProgramRegistryForm from './ProgramRegistryForm';
import { formValidationSchema } from './schema';

const firstStepFields = [
  'state_program_id',
  'name',
  'repair_type_id',
  'plan_date_start',
  'plan_date_end',
];

class ProgramRegistryFormWrap extends FormWrap {
  state = {
    fromCreating: false,
  };
  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('repair').programRegistryPost;
    this.updateAction = context.flux.getActions('repair').programRegistryPut;
  }

  async handleSubmitFirstForm() {
    let { formState } = this.state;
    let result = null;
    Object.entries(formState).forEach(([key, val])=> {
      if (typeof val === 'string') {
        formState[key] = val.trim();
      }
    });
    if (this.schema) {
      this.schema.properties.forEach((p) => {
        if (p.type === 'number' && p.float) {
          formState[p.key] = !isNaN(formState[p.key]) && formState[p.key] !== null ? parseFloat(formState[p.key]) : null;
        }
        if (p.type === 'number' && p.integer) {
          const parsedValue = parseInt(formState[p.key], 10);
          formState[p.key] = !isNaN(parsedValue) ? parsedValue : null;
        }

        if (typeof p.isSubmitted === 'function') {
          formState = p.isSubmitted(formState) ? formState : omit(formState, p.key);
        }
      });
    }

    try {
      this.setState({
        saveButtonLabel: 'Сохранение...',
        saveButtonEnability: false,
      });
      result = await this.createAction(formState);
      this.setState({
        saveButtonLabel: 'Сохранить',
        saveButtonEnability: true,
      });
    } catch (e) {
      this.setState({
        saveButtonLabel: 'Сохранить',
        saveButtonEnability: true,
      });
      console.warn(e);
      return;
    }
    this.props.onFormHide();
    this.setState({ fromCreating: true });
    this.props.setNewSelectedElement(result.result.rows[0]);
  }

  changeVersion = () => {

  }

  handleExportVersion = () => {
    console.log('i download excel');
  }
  loadFile = () => {
    console.log('i load');
  }
  makeVersion = () => {
    console.log('i make');
  }
  sendToApply = () => {
    console.log('i send');
  }
  onSubmitWithouContinue = ({ close = true }) => {
    console.log(close)
    console.log('i save')
    console.log(`form close ? - ${close}`)
  }
  onSubmitAndContinue = (e) => {
    const ans = this.onSubmitWithouContinue({ close: false });
    console.log('i continue');
  }
  renderFromFirstCreate() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const stateCanSave = Object.entries(this.state.canSave).reduce((obj, [key, val]) => {
      if (firstStepFields.includes(key)) {
        obj[key] = val;
      }
      return obj;
    }, {});
    const canSave = isPermitted && stateCanSave && saveButtonEnability;

    return (
      <ProgramRegistryFormCreate
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        canSave={canSave}
        onSubmit={this.handleSubmitFirstForm.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
    );
  }

  renderFrom() {
    const {
      entity,
      isPermitted = false,
    } = this.props;
    const {
      saveButtonEnability = true,
      fromCreating = false,
    } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return (
      <ProgramRegistryForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        canSave={canSave}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        fromCreating={fromCreating}

        version={0}
        versionOptions={[]}
        chnageVersion={this.changeVersion}

        handleExportVersion={this.handleExportVersion}
        loadFile={this.loadFile}
        makeVersion={this.makeVersion}
        sendToApply={this.sendToApply}
        onSubmit={this.onSubmitWithouContinue}
        onSubmitAndContinue={this.onSubmitAndContinue}
      />
    );
  }

  render() {
    const { showForm } = this.props;
    if (!showForm) return null;
    console.log(this.props)
    const {
      formState = {},
    } = this.state;
    const uniqueField = this.uniqueField || 'id';

    if (isEmpty(formState[uniqueField])) {
      return this.renderFromFirstCreate();
    }
    return this.renderFrom();
  }
}

export default enhanceWithPermissions(ProgramRegistryFormWrap);
