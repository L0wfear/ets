import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import PDF from 'react-pdf-js';
import Preloader from '../../ui/Preloader.jsx';

export default class PDFViewModal extends Component {

  static get propTypes() {
    return {
      onHide: PropTypes.func,
      show: PropTypes.bool,
      url: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    window.URL.revokeObjectURL(this.state.url);
    const token = JSON.parse(window.localStorage.getItem('ets-session'));
    // TODO blob
    if (nextProps.url !== this.props.url && nextProps.url !== null) {
      fetch(nextProps.url, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      }).then(r => r.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        this.setState({ url });
      }));
    }
  }

  onHide() {
    this.setState({ url: '' });
    this.props.onHide();
  }

  render() {
    return (
      <Modal {...this.props} onHide={this.onHide.bind(this)}>
        <Modal.Body bsClass="null">
          {!this.state.url
            ?
            <Preloader type="mainpage" visible={this.props.show} />
            :
            <PDF file={this.state.url} />
          }
        </Modal.Body>
      </Modal>
    );
  }

}
