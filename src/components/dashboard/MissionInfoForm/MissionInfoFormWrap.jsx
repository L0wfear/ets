import React from 'react';
import Div from 'components/ui/Div.jsx';
import MissionInfoForm from 'components/dashboard/MissionInfoForm/new/MissionInfoForm.tsx';

import FormWrap from '../../compositions/FormWrap.jsx';

export default class MissionInfoFormWrap extends FormWrap {
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
          {...this.state}
        />
      </Div>
    );
  }
}
