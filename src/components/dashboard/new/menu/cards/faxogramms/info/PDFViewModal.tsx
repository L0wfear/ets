import * as React from 'react';
import { Modal } from 'react-bootstrap';
import PDF from 'react-pdf-js';

import ModalBody from 'components/ui/Modal';
import Preloader from 'components/ui/Preloader';

type PropsPDFViewModal = {
  onHide: Function;
  blob: any;
};

type StatePDFViewModal = {
  url: string;
}

class PDFViewModal extends React.Component<PropsPDFViewModal, StatePDFViewModal> {
  state = {
    url: '',
  };

  componentDidMount() {
    window.URL.revokeObjectURL(this.state.url);
    if (this.props.blob) {
      const url = window.URL.createObjectURL(this.props.blob);
      this.setState({ url });
    }
  }

  render() {
    return (
      <Modal onHide={this.props.onHide}>
        <ModalBody bsClass="null">
          {
            !this.state.url
            ? <Preloader type="mainpage" />
            : <PDF file={this.state.url} />
          }
        </ModalBody>
      </Modal>
    );
  }
}


export default PDFViewModal;
