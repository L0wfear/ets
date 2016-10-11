import React from 'react';
import { render } from 'react-dom';
import { Modal, Button } from 'react-bootstrap';
import { autobind } from 'core-decorators';

const promptDiv = document.createElement('div');
promptDiv.id = 'prompt';
document.body.appendChild(promptDiv);

@autobind
class Prompt extends React.Component {
  constructor() {
    super();

    this.state = {
      isVisible: false,
    };

    window.confirmDialog = global.confirmDialog = this.showConfirm.bind(this);
  }

  showConfirm({ title, body }) {
    const promise = new Promise((res, rej) => {
      this.setState({
        isVisible: true,
        title,
        body,
        res,
        rej,
      });
    });
    return promise;
  }

  hide() {
    this.setState({ isVisible: false });
  }

  ok() {
    this.state.res(this.state);
    this.hide();
  }

  cancel() {
    this.state.rej();
    this.hide();
  }

  render() {
    return (
      <Modal
        show={this.state.isVisible}
        bsSize={"small"}
      >
        <Modal.Header>
          {this.state.title}
        </Modal.Header>
        <Modal.Body>
          {typeof this.state.body === 'function' ? this.state.body(this) : this.state.body}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.ok}>Ок</Button>
          <Button onClick={this.cancel}>Отмена</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

render(<Prompt />, document.getElementById('prompt'));
