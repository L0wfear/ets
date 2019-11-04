import * as React from 'react';

import UNSAFE_FormWrap from 'components/old/compositions/UNSAFE_FormWrap';
import UserNotificationForm from 'components/old/notifications/UserNotificationForm';

class UserNotificationFormWrap extends UNSAFE_FormWrap<any, any> {
  render() {
    return this.props.showForm ? (
      <UserNotificationForm
        formState={this.state.formState}
        canSave={this.state.canSave}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        history={this.props.history}
        handleFormChange={this.handleFormStateChange}
        onSubmit={this.handleFormSubmit}
      />
    ) : null;
  }
}

export default UserNotificationFormWrap;
