import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import PDF from 'react-pdf-js';

import ModalBody from 'components/ui/Modal';
import Preloader from '../../ui/Preloader.jsx';

export default class PDFViewModal extends Component {

  static get propTypes() {
    return {
      onHide: PropTypes.func,
      show: PropTypes.bool,
      blob: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
  }

  async componentWillReceiveProps(nextProps) {
    window.URL.revokeObjectURL(this.state.url);
    if (nextProps.blob !== this.props.blob && nextProps.blob !== null) {
      const url = window.URL.createObjectURL(nextProps.blob);
      this.setState({ url });
    }
  }

  onHide = () => {
    this.setState({ url: '' });
    this.props.onHide();
  }

  render() {
    return (
      <Modal {...this.props} onHide={this.onHide}>
        <ModalBody bsClass="null">
          {!this.state.url
            ? <Preloader type="mainpage" visible={this.props.show} />
            : <PDF file={this.state.url} />
          }
        </ModalBody>
      </Modal>
    );
  }

}
