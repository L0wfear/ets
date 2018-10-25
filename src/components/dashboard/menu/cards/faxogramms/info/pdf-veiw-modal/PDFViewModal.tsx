import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import PDF from 'react-pdf-js';

import ModalBody from 'components/ui/Modal';
import Preloader from 'components/ui/new/preloader/Preloader';

import {
  PropsPDFViewModal,
  StatePDFViewModal,
} from 'components/dashboard/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModal.h';

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
      <Modal show onHide={this.props.onHide}>
        <ModalBody bsClass="null">
          {
            !this.state.url
            ? <Preloader typePreloader="mainpage" />
            : <PDF file={this.state.url} />
          }
        </ModalBody>
      </Modal>
    );
  }
}


export default PDFViewModal;
