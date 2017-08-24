import React from 'react';

import { connectToStores } from 'utils/decorators';
import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import TechInspectionForm from './TechInspectionForm';
import { formValidationSchema } from './schema';

@connectToStores(['session'])
class TechInspectionFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    const { car_id = -1 } = props;

    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').techInspection.bind(null, 'post', car_id === -1 ? {} : { car_id });
    this.updateAction = context.flux.getActions('autobase').techInspection.bind(null, 'put', car_id === -1 ? {} : { car_id });
  }

  render() {
    const { entity, car_id = -1, isPermitted = false } = this.props;
    const userCompanyId = this.props.currentUser.company_id;
    const isBelongToUserCompany = this.state.formState.company_id === userCompanyId;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability && isBelongToUserCompany;

    return this.props.showForm ?
      <TechInspectionForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        cols={this.props.meta.cols}
        car_id={car_id}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted && isBelongToUserCompany}
        canSave={canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }
}

export default enhanceWithPermissions(TechInspectionFormWrap);
