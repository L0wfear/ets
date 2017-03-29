import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import PolyMap from 'components/map/PolyMap.jsx';
import Div from 'components/ui/Div.jsx';

class MapModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      polys: {}
    };
  }

  componentWillReceiveProps(props) {
    if (props.showForm) {
      this.setState({
        polys: {
          object: {
            shape: {
              type: 'Point',
              coordinates: props.coords,
            },
          },
        },
      });
    }
  }

  render() {
    return (
      <Modal show={this.props.showForm} onHide={this.props.onFormHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Просмотр объекта</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Div className="route-creating">
            <PolyMap
              onFeatureClick={() => {}}
              polys={this.state.polys}
              maxZoom={11}
            />
          </Div>
        </ModalBody>

      </Modal>
    );
  }
}

export default MapModal;
