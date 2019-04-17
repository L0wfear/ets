import React from 'react';
import { render } from 'react-dom';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import EtsModal from 'components/new/ui/modal/Modal';

const promptDiv = document.createElement('div');
promptDiv.id = 'prompt';
document.body.appendChild(promptDiv);

class Prompt extends React.Component {
  constructor() {
    super();

    this.state = {
      isVisible: false,
      checkOnOk: () => true,
    };

    window.confirmDialog = global.confirmDialog = this.showConfirm.bind(this);
  }

  showConfirm = ({
    title,
    body,
    okName,
    cancelName,
    bsSize = 'small',
    defaultState = {},
    checkOnOk = () => true,
  }) => {
    const promise = new Promise((res, rej) => {
      this.setState({
        isVisible: true,
        title,
        bsSize,
        body,
        res,
        rej,
        okName,
        cancelName,
        checkOnOk,
        ...defaultState,
      });
    });
    return promise;
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  ok = () => {
    if (this.state.checkOnOk(this)) {
      this.state.res(this.state);
      this.hide();
    }
  };

  cancel = () => {
    this.state.rej();
    this.hide();
  };

  render() {
    return (
      <EtsModal
        show={this.state.isVisible}
        bsSize={this.state.bsSize}
        id="delete-form">
        <Modal.Header>{this.state.title}</Modal.Header>
        <Modal.Body>
          {typeof this.state.body === 'function'
            ? this.state.body(this)
            : this.state.body}
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button onClick={this.ok}>{this.state.okName || 'Ок'}</Button>
            <Button onClick={this.cancel}>
              {this.state.cancelName || 'Отмена'}
            </Button>
          </div>
        </Modal.Footer>
      </EtsModal>
    );
  }
}

render(<Prompt />, document.getElementById('prompt'));
