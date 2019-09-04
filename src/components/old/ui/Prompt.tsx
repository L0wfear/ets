import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class Prompt extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      checkOnOk: () => true,
    };

    global.confirmDialog = this.showConfirm.bind(this);
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
      <EtsBootstrap.ModalContainer
        id="delete-form"
        show={this.state.isVisible}
        bsSize={this.state.bsSize}
      >
        <EtsBootstrap.ModalHeader>
          <EtsBootstrap.ModalTitle>
            {this.state.title}
          </EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <EtsBootstrap.ModalBody>
          {typeof this.state.body === 'function'
            ? this.state.body(this)
            : this.state.body}
        </EtsBootstrap.ModalBody>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={this.ok}>
            {this.state.okName || 'Ок'}
          </EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={this.cancel}>
            {this.state.cancelName || 'Отмена'}
          </EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default Prompt;
