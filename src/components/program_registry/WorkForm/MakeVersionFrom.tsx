import * as React from 'react';
import * as RB from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';

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
      <RB.Modal {...this.props} onHide={this.onHide} backdrop="static">
        <RB.Modal.Header closeButton>
          <RB.Modal.Title id="contained-modal-title-lg">{this.props.title}</RB.Modal.Title>
        </RB.Modal.Header>
        <Div style={{ padding: '0px 15px' }}>
          {TextBody}
          <RB.Row>
            <RB.Col md={12}>
              <FileField
                label="Файл"
                value={this.state.files}
                onChange={this.handleChange}
                boundKeys={['files']}
                isLoading={this.props.onOverlayLoading}
              />
            </RB.Col>
          </RB.Row>
        </Div>
        <ModalBody />
        <RB.Modal.Footer>
          <RB.Button disabled={!canSave} onClick={this.onSubmit}>{this.props.btName}</RB.Button>
        </RB.Modal.Footer>
      </RB.Modal>
    );
  }
}

export default MakeFileModal;
