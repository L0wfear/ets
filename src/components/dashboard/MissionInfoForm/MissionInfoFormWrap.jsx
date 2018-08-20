import React from 'react';
import Div from 'components/ui/Div.jsx';
import MissionInfoForm from 'components/dashboard/MissionInfoForm/new/MissionInfoForm';
import { FluxContext } from 'utils/decorators';

import FormWrap from '../../compositions/FormWrap.jsx';

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
        />
      </Div>
    );
  }
}

export default MissionInfoFormWrap;
