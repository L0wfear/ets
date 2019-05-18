import * as React from 'react';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import MapEts from 'components/new/ui/map/MapEts';

import { MapEtsContainer } from 'components/reports/operational/track_events/form/map-geoobject/styled/styled';
import LayerOneGeometry from 'components/reports/operational/track_events/form/map-geoobject/layers/layer-one-geometry/LayerOneGeometry';

import { MapEtsConsumer } from 'components/new/ui/map/context/MapetsContext';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
    };
  }

  static getDerivedStateFromProps(nextProps: PropsGeoObjectsMapModalNew, prevState: StateGeoObjectsMapModalNew) {
    const { coords } = nextProps;
    if (coords !== prevState.coords) {
      return {
        coords,
        geoobjects: makeGeoobjects(coords),
      };
    }

    return null;
  }

  render() {
    return (
      <EtsBootstrap.ModalContainer id="modal-geoobjects-map" show onHide={this.props.onFormHide} bsSize="large" backdrop="static">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Просмотр объекта</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
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
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default GeoObjectsMapModalNew;
