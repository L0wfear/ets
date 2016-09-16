import React from 'react';
import Div from 'components/ui/Div.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import MissionInfoForm from './MissionInfoForm.jsx';

export default class MissionInfoFormWrap extends FormWrap {

  handleFormSubmit() {
    this.props.onFormHide();
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <MissionInfoForm
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
