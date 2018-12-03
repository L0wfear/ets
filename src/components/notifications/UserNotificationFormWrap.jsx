import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import UserNotificationForm from 'components/notifications/UserNotificationForm';

export default class UserNotificationFormWrap extends FormWrap {
  handleFormHide = () => {
    this.props.onFormHide();
  }

  render() {
    return this.props.showForm
      ? (
        <UserNotificationForm
          formState={this.state.formState}
          canSave={this.state.canSave}
          show={this.props.showForm}
          onHide={this.handleFormHide}
          markAllAsRead={this.handleMarkAllAsRead}
          history={this.props.history}
          handleFormChange={this.handleFormStateChange}
          onSubmit={this.handleFormSubmit}
        />
      )
      : null;
  }
}
