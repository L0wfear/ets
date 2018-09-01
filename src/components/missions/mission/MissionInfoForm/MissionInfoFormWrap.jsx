import React from 'react';
import Div from 'components/ui/Div';
import MissionInfoForm from 'components/dashboard/MissionInfoForm/new/MissionInfoForm';
import { FluxContext } from 'utils/decorators';

import FormWrap from 'components/compositions/FormWrap';

// надеюсь временно
@FluxContext
class MissionInfoFormWrap extends FormWrap {
  handleFormSubmit = () => this.props.onFormHide();

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <MissionInfoForm
          {...this.props}
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit}
          handleFormChange={this.handleFormStateChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          flux={this.context.flux}
          {...this.state}
          title={undefined}
        />
      </Div>
    );
  }
}

export default MissionInfoFormWrap;
