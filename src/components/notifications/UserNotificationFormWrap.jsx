import React from 'react';

import UNSAFE_FormWrap from 'components/compositions/UNSAFE_FormWrap';
import UserNotificationForm from 'components/notifications/UserNotificationForm';

export default class UserNotificationFormWrap extends UNSAFE_FormWrap {
  handleFormHide = () => {
    this.props.onFormHide();
  };

  render() {
    return this.props.showForm ? (
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
    ) : null;
  }
}
