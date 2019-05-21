import React from 'react';
import { render } from 'react-dom';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import EtsThemeProvider from 'components/new/ui/@bootstrap/EtsThemeProvider';

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
      <EtsThemeProvider>
        <EtsBootstrap.ModalContainer
          show={this.state.isVisible}
          bsSize={this.state.bsSize}
          id="delete-form">
          <EtsBootstrap.ModalHeader>
            {this.state.title}
          </EtsBootstrap.ModalHeader>
          <EtsBootstrap.ModalBody>
            {typeof this.state.body === 'function'
              ? this.state.body(this)
              : this.state.body}
          </EtsBootstrap.ModalBody>
          <EtsBootstrap.ModalFooter>
            <div>
              <EtsBootstrap.Button onClick={this.ok}>
                {this.state.okName || 'Ок'}
              </EtsBootstrap.Button>
              <EtsBootstrap.Button onClick={this.cancel}>
                {this.state.cancelName || 'Отмена'}
              </EtsBootstrap.Button>
            </div>
          </EtsBootstrap.ModalFooter>
        </EtsBootstrap.ModalContainer>
      </EtsThemeProvider>
    );
  }
}

render(<Prompt />, document.getElementById('prompt'));
