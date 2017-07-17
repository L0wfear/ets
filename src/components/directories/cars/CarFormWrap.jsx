import React from 'react';

import { ExtDiv } from 'components/ui/Div.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import BaseCarForm from './CarForm.jsx';

const CarForm = enhanceWithPermissions(BaseCarForm);

export default class CarFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.uniqueField = 'asuods_id';
    this.updateAction = context.flux.getActions('cars').updateCarAdditionalInfo;
  }

  render() {
    return (
      <ExtDiv hidden={!this.props.showForm}>
        <CarForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit}
          permissions={['car.update']}
          addPermissionProp={true}
          handleFormChange={this.handleFormStateChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          {...this.state}
        />
      </ExtDiv>
    );
  }

}
