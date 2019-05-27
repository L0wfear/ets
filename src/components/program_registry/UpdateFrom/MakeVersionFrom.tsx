import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import Div from 'components/ui/Div';
import { FileField } from 'components/ui/input/fields';
import ModalBody from 'components/ui/Modal';
/**
 * @todo
 * Описать stage & props
 */
class MakeFileModal extends React.Component<any, any> {
  state = {
    files: [],
  };
  getCanSave: any = () => {
    const { files = [] } = this.state;
    return !!files[0];
  }
  handleChange = (name, val) => this.setState({ [name]: val });
  setNullFile = () => this.setState({ files: [] });

  onHide = () => {
    this.props.onHide();
    this.setNullFile();
  }
  onSubmit = () => this.props.onSubmit(this.state).then(this.setNullFile);

  render() {
    const canSave: boolean = this.getCanSave(this.props);
    const { TextBody } = this.props;

    return (
      <EtsBootstrap.ModalContainer {...this.props} id="modal-make-version" onHide={this.onHide} backdrop="static">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{this.props.title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <Div style={{ padding: '0px 15px' }}>
          {TextBody}
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FileField
                label="Файл"
                value={this.state.files}
                onChange={this.handleChange}
                boundKeys="files"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </Div>
        <ModalBody />
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button disabled={!canSave} onClick={this.onSubmit}>{this.props.btName}</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default MakeFileModal;
