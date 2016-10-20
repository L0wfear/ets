import React, { Component } from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import { GEOOBJECTS_TYPES } from 'constants/geoobjects';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import PolyMap from '../../map/PolyMap.jsx';
import Div from 'components/ui/Div.jsx';
import _ from 'lodash';

@connectToStores(['geoObjects'])
@FluxContext
class GeoObjectsMapModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom: null,
      center: null,
      polys: {},
    };
  }

  componentDidMount() {
    const sessionStore = this.context.flux.getStore('session');
    this.context.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(this.props.entity);

    this.setState({
      zoom: sessionStore.getCurrentUser().getCompanyMapConfig().zoom,
      center: sessionStore.getCurrentUser().getCompanyMapConfig().coordinates,
    });
  }

  componentWillReceiveProps(props) {
    if (props.showForm) {
      this.setState({
        polys: _.pick(props[`${GEOOBJECTS_TYPES[props.entity]}Polys`], props.element.id)
      })
    }
  }

  render() {
    return (
      <Modal show={this.props.showForm} onHide={this.props.onFormHide} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Просмотр объекта</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Div className="route-creating">
            <PolyMap
              onFeatureClick={() => {}}
              polys={this.state.polys}
              zoom={this.state.zoom}
              center={this.state.center}
            />
          </Div>
        </Modal.Body>

      </Modal>
    );
  }
}

export default GeoObjectsMapModal;
