import React from 'react';

import { unpackObjectData } from 'api/utils';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import FormWrap from 'components/compositions/FormWrap';
import CarForm from 'components/directories/autobase/cars/CarForm';
import schema from 'components/directories/autobase/cars/schema';

class CarFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.uniqueField = 'asuods_id';
    this.updateAction = context.flux.getActions('cars').updateCarAdditionalInfo;
  }

  async inheritedComponentWillReceiveProps(nextProps) {
    if (this.props.showForm !== nextProps.showForm && nextProps.element) {
      const { element } = nextProps;

      const formState = element || {};

      const register_passport_info
        = (await this.context.flux
          .getActions('cars')
          .getCarPassportRegistryInfo(element.asuods_id)) || {};

      const { type = '', id = null } = register_passport_info;

      this.setState({
        formState: {
          ...formState,
          passport_type: type,
          passport_id: id,
          ...unpackObjectData(
            `passport_${type.toLowerCase()}`,
            register_passport_info,
          ),
        },
      });
    }
  }

  handleFormHide = () => {
    if (this.props.location.search) {
      this.props.history.push(this.props.match.url);
    }
    this.props.onFormHide();
  };

  handleFormSubmitWrap = () => {
    if (this.props.location.search) {
      this.props.history.push(this.props.match.url);
    }

    return this.handleFormSubmit().then(() => {
      if (this.props.refreshList) {
        this.props.refreshList();
      }
    });
  };

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ? (
      <CarForm
        formState={this.state.formState}
        onSubmit={this.handleFormSubmitWrap}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.handleFormHide}
        {...this.state}
        canSave={canSave}
        location={this.props.location}
      />
    ) : null;
  }
}

export default enhanceWithPermissions(CarFormWrap);
