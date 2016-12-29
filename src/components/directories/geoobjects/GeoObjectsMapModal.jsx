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
      polys: {}
    };
  }

  componentDidMount() {
    this.context.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(this.props.entity !== 'pgm' ? this.props.entity : 'pgm_store');
  }

  componentWillReceiveProps(props) {
    if (props.showForm) {
      this.setState({
        polys: _.pick(props[`${GEOOBJECTS_TYPES[props.entity]}Polys`], props.element.id)
      })
    }
  }

  render() {

    const FIELDS = _.zipObject(this.props.meta.cols.map(e => e.name), this.props.meta.cols.map(e => e.displayName));
    const form = this.props.element ? _.map(FIELDS, (name, key) => {
      if (this.props.element[key]) return (
        <Div key={key} style={{marginBottom: 10}}>
          <label style={{display: 'block', margin: 0}}>{name}:</label>
          {this.props.element[key]}
        </Div>
      )
    }) : '';

    return (
      <Modal show={this.props.showForm} onHide={this.props.onFormHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Просмотр объекта</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={4}>
              {form}
            </Col>
            <Col md={8}>
              <Div className="route-creating">
                <PolyMap
                  onFeatureClick={() => {}}
                  polys={this.state.polys}
                  maxZoom={11}
                />
              </Div>
            </Col>
          </Row>
        </Modal.Body>

      </Modal>
    );
  }
}

export default GeoObjectsMapModal;
