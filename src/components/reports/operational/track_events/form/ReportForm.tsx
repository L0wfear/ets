import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import MapEts from 'components/map/MapEts';

import { MapEtsContainer } from 'components/reports/operational/track_events/form/map-geoobject/styled/styled';
import LayerOneGeometry from 'components/reports/operational/track_events/form/map-geoobject/layers/layer-one-geometry/LayerOneGeometry';

import { MapEtsConsumer } from 'components/map/context/MapetsContext';

type PropsGeoObjectsMapModalNew = {
  onFormHide: () => any;
  coords: [number, number];
};

type StateGeoObjectsMapModalNew = {
  geoobjects: any;
  coords: [number, number];
};

const makeGeoobjects = (coords) => {
  return {
    any: {
      'any/0': {
        shape: {
          type: 'Point',
          coordinates: coords,
        },
      },
    },
  };
};

class GeoObjectsMapModalNew extends React.PureComponent<PropsGeoObjectsMapModalNew, StateGeoObjectsMapModalNew> {
  constructor(props) {
    super(props);
    const { coords } = props;

    this.state = {
      coords,
      geoobjects: makeGeoobjects(coords),
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { coords } = nextProps;
    if (coords !== prevState.coords) {
      return {
        coords,
        geoobjects: makeGeoobjects(coords),
      }
    }

    return null;
  }

  render() {
    return (
      <Modal id="modal-geoobjects-map" show onHide={this.props.onFormHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Просмотр объекта</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader>
          <MapEtsContainer>
            <MapEtsConsumer>
            {
              ({ setMapToContext, removeMapToContext }) => (
                <MapEts
                  enableInteractions
                  setMapToContext={setMapToContext}
                  removeMapToContext={removeMapToContext}
                  mapKey="reportForm"
                >
                  {
                    ({ map, centerOn }) => (
                      <>
                        <LayerOneGeometry map={map} centerOn={centerOn} geoobjects={this.state.geoobjects} />
                      </>
                    )
                  }
                </MapEts>
              )
            }
            </MapEtsConsumer>
          </MapEtsContainer>
        </ModalBodyPreloader>
      </Modal>
    )
  }
}

export default GeoObjectsMapModalNew;
