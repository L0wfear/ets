import * as React from 'react';
import NotificationSystemOrigin from 'react-notification-system';
import styled, { css } from 'styled-components';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';

const NotificationSystemStyledLg = css`
  .notifications-br {
    width: 450px!important;
  }
  .notification-title {
    font-size: 20px!important;
  
  };
  ${ButtonStyled} {
    font-size: 20px!important;
  }
  .text-version-container * {
    font-size: 18px!important;
  }
`;
const NotificationSystemStyledDefault = css`
`;

export const NotificationSystemStyled = styled.div<{size?: string;}>`
  &&& {
    background: red;
    ${({ size }) => (
    size === 'lg'
      ? NotificationSystemStyledLg
      : NotificationSystemStyledDefault
  )}
  }
`;

type StateProps = any;

/*
  INFO
  https://github.com/igorprado/react-notification-system
 */
class NotificationSystem extends React.Component<any, StateProps> {
  node = React.createRef<any>();
  constructor(props) {
    super(props);

    global.NOTIFICATION_SYSTEM = this;
    this.state = null;
  }

  notifyWithObject: typeof global.NOTIFICATION_SYSTEM.notifyWithObject  = (notification) => {
    this.setState({
      ...notification,
    });
    this.node.current.addNotification(notification);
  };

  removeNotification: typeof global.NOTIFICATION_SYSTEM.removeNotification = (uid) => {
    this.node.current.removeNotification(uid);
  };

  notify: typeof global.NOTIFICATION_SYSTEM.notify = (text: string | object, type = 'success', position = 'tc') => {
    if (typeof this.node.current === 'undefined') {
      return undefined;
    }

    if (typeof text === 'object') {
      return this.notifyWithObject(text);
    }

    return this.notifyWithObject({
      message: text,
      level: type,
      position,
    });
  };

  render() {
    const notifyProps = this.state
      ? {...this.state}
      : {};

    return (
      <NotificationSystemStyled id="notifications" {...notifyProps}>
        <NotificationSystemOrigin ref={this.node} />
      </NotificationSystemStyled>
    );
  }
}

export default NotificationSystem;
