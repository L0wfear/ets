import React from 'react';

import { unpackObjectData } from 'api/utils';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import CarForm from './CarForm.jsx';
import schema from './schema';

class CarFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.uniqueField = 'asuods_id';
    this.updateAction = context.flux.getActions('cars').updateCarAdditionalInfo;
  }
  async inheritedComponentWillReceiveProps(nextProps) {
    if (this.props.showForm !== nextProps.showForm && nextProps.element) {
      const {
        element,
      } = nextProps;

      const formState = element || {};

      const register_info = await this.context.flux.getActions('cars').getCarRegisterInfo(element.asuods_id) || {};

      this.setState({
        formState: {
          ...formState,
          ...unpackObjectData('register', register_info),
        },
      });
    }
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
