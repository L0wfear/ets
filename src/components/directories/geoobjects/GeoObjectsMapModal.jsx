import React, { Component } from 'react';
import _ from 'lodash';
import L from 'lodash/fp';
import { Modal, Row, Col } from 'react-bootstrap';

import { connectToStores, FluxContext } from 'utils/decorators';
import { GEOOBJECTS_TYPES, GORMOST_GEOOBJECTS_LIST } from 'constants/geoobjects';
import Div from 'components/ui/Div.jsx';
import ModalBody from 'components/ui/Modal';
import PolyMap from 'components/map/PolyMap.jsx';

const extractData = L.prop('data');

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
    if (GORMOST_GEOOBJECTS_LIST.includes(this.props.entity)) {
      this.context.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(this.props.entity, 'GormostService', {});
    } else {
      this.context.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(this.props.entity !== 'pgm' ? this.props.entity : 'pgm_store');
    }
  }

  componentWillReceiveProps(props) {
    if (props.showForm) {
      this.setState({
        polys: _.pick(props[`${GEOOBJECTS_TYPES[props.entity]}Polys`], props.element.id)
      })
    }
  }

  render() {
    console.log('props', this.props);
    const FIELDS = _.zipObject(this.props.meta.cols.map(e => e.name), this.props.meta.cols.map(e => e.displayName));
    const form = this.props.element ? _.map(FIELDS, (name, key) => {
      if (this.props.element[key]) {
        const renderer = _.get(this.props, ['renderers', key], null) || extractData;

        return (
          <Div key={key} style={{marginBottom: 10}}>
            <label style={{display: 'block', margin: 0}}>{name}:</label>
            {renderer({ data: this.props.element[key] })}
          </Div>
        );
      }
    }) : '';

    return (
      <Modal show={this.props.showForm} onHide={this.props.onFormHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Просмотр объекта</Modal.Title>
        </Modal.Header>

        <ModalBody>
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
        </ModalBody>

      </Modal>
    );
  }
}

export default GeoObjectsMapModal;
