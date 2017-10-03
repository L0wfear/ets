import * as React from 'react';
import { Modal } from 'react-bootstrap';

import { FluxContext } from 'utils/decorators';

@FluxContext
class NotificationModal extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  onHide = () => this.setState({ show: false });
  getHeader = () => null;
  getBody = () => null;
  getFooter = () => null;

  render() {
    return (
      <Modal show={this.state.show} onHide={this.onHide}>
        {this.getHeader()}
        {this.getBody()}
        {this.getFooter()}
      </Modal>
    );
  }
}

export default NotificationModal;
