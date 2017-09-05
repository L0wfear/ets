import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import UserNotificationForm from './UserNotificationForm.jsx';

export default class UserNotificationFormWrap extends FormWrap {
  handleFormHide = () => {
    this.props.onFormHide();
    if (!this.state.formState.is_read) {
      this.context.flux.getActions('userNotifications').getNotifications();
    }
  }
  render() {
    return this.props.showForm ?
      <UserNotificationForm
        formState={this.state.formState}
        canSave={this.state.canSave}
        show={this.props.showForm}
        onHide={this.handleFormHide}
        markAllAsRead={this.handleMarkAllAsRead}
        history={this.props.history}
      />
      : null;
  }
}
