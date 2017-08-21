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
  handleFormHide = () => {
    if (Object.keys(this.props.location.query).length > 0) {
      this.props.history.replaceState(null, this.props.location.pathname, {});
    }
    this.props.onFormHide();
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
        onHide={this.handleFormHide}
        {...this.state}
        canSave={canSave}
        location={this.props.location}
        history={this.props.history}
      />
      :
      null;
  }
}

export default enhanceWithPermissions(CarFormWrap);
