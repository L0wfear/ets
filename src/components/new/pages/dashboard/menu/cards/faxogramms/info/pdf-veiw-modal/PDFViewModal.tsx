import * as React from 'react';

import PDF from 'react-pdf-js';
import * as Raven from 'raven-js';

import ModalBody from 'components/old/ui/Modal';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

import {
  PropsPDFViewModal,
  StatePDFViewModal,
} from 'components/new/pages/dashboard/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModal.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class PDFViewModal extends React.Component<
  PropsPDFViewModal,
  StatePDFViewModal
> {
  state = {
    url: '',
  };

  componentDidMount() {
    try {
      window.URL.revokeObjectURL(this.state.url);
      if (this.props.blob) {
        const url = window.URL.createObjectURL(this.props.blob);
        this.setState({ url });
      }
    } catch (error) {
      global.NOTIFICATION_SYSTEM.notify(
        'Ошибка формирования pdf',
        'error',
        'tr',
      );
      Raven.captureException(new Error(error));
      this.props.onHide();
    }
  }

  render() {
    return (
      <EtsBootstrap.ModalContainer id="pdf_view_modal" show onHide={this.props.onHide} noPadding={true}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{this.props.title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBody bsClass="null">
          {!this.state.url ? (
            <PreloadNew typePreloader="mainpage" />
          ) : (
            <PDF file={this.state.url} />
          )}
        </ModalBody>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default PDFViewModal;
