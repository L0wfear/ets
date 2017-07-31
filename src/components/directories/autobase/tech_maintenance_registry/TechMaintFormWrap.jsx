import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import TechMaintForm from './TechMaintForm';
import { formValidationSchema } from './schema';

class TechMaintFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    const { car_id = -1 } = props;

    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;
    this.createAction = context.flux.getActions('autobase').techMaint.bind(null, 'post', car_id === -1 ? {} : { car_id });
    this.updateAction = context.flux.getActions('autobase').techMaint.bind(null, 'put', car_id === -1 ? {} : { car_id });
  }
  // TODO Надо избавляться от наследования и делать композицию компонентов
  inheritedComponentWillReceiveProps(nextProps) {
    if (this.props.showForm !== nextProps.showForm) {
      const {
        car_id,
        car_model_id,
        gov_number,
      } = nextProps;

      this.setState({
        formState: {
          car_id,
          car_model_id,
          gov_number,
        },
      });
    }
  }
  render() {
    const { entity, saveButtonEnability = true } = this.props;
    const canSave = this.props.isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <TechMaintForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={canSave}
        isPermitted={this.props.isPermitted}
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }

}

export default enhanceWithPermissions(TechMaintFormWrap);
