import * as React from 'react';
import * as RB from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';

import { loadingOverlay } from 'components/ui/LoadingOverlay';
import { FileField } from 'components/ui/input/fields';
import ModalBody from 'components/ui/Modal';

@loadingOverlay
class MakeFileModal extends React.Component<any, any> {
  getCanSave: any = () => {
    const { state: { files = [] } } = this.props;
    return !!files[0];
  }
  render() {
    const canSave: boolean = this.getCanSave(this.props);

    return (
      <RB.Modal {...this.props} backdrop="static">
        <RB.Modal.Header closeButton>
          <RB.Modal.Title id="contained-modal-title-lg">{ 'Создание новой версии' }</RB.Modal.Title>
        </RB.Modal.Header>
        <Div style={{ padding: '0px 15px' }}>
          <RB.Row>
            <RB.Col md={12}>
              <FileField
                label="Файл"
                value={this.props.state.files}
                onChange={this.props.handleChange}
                boundKeys={['files']}
                isLoading={this.props.onOverlayLoading}
              />
            </RB.Col>
          </RB.Row>
        </Div>
        <ModalBody />
        <RB.Modal.Footer>
          <RB.Button disabled={!canSave} onClick={this.props.onSubmit}>{'Загрузить файл и создать версию'}</RB.Button>
        </RB.Modal.Footer>
      </RB.Modal>
    );
  }
}

export default MakeFileModal;
