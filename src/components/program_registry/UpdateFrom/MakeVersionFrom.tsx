import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import Div from 'components/ui/Div';
import { loadingOverlay } from 'components/ui/LoadingOverlay';
import { FileField } from 'components/ui/input/fields';
import ModalBody from 'components/ui/Modal';
/**
 * @todo
 * Описать stage & props
 */
@loadingOverlay
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
      <Modal {...this.props} id="modal-make-version" onHide={this.onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: '0px 15px' }}>
          {TextBody}
          <Row>
            <Col md={12}>
              <FileField
                label="Файл"
                value={this.state.files}
                onChange={this.handleChange}
                boundKeys={['files']}
                isLoading={this.props.onOverlayLoading}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!canSave} onClick={this.onSubmit}>{this.props.btName}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default MakeFileModal;
