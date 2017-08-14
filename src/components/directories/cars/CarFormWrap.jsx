import React from 'react';

import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import CarForm from './CarForm.jsx';


class CarFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.uniqueField = 'asuods_id';
    this.updateAction = context.flux.getActions('cars').updateCarAdditionalInfo;
  }

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <CarForm
        formState={this.state.formState}
        onSubmit={this.handleFormSubmit}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        {...this.state}
        canSave={canSave}
      />
      :
      null;
  }
}

export default enhanceWithPermissions(CarFormWrap);
