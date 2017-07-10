import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import { schema } from 'models/BatteryRegModel.js';
import BaseBatteryForm from './BatteryRegForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';


const BatteryForm = enhanceWithPermissions(BaseBatteryForm);
//const BatteryForm = BaseBatteryForm;

export default class EmployeeFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.schema = schema;
    this.createAction = (...arg) => console.log('create', arg);
    this.uniqueField = 'battery__id';
    this.updateAction = context.flux.getActions('autobase').updateAutobaseListByType('btr');
  }

  render() {
    const { entity } = this.props;
    return this.props.showForm ?
      <BatteryForm
        formState={this.state.formState}
        cols={this.props.meta.cols}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }

}
