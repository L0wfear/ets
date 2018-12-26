import * as React from 'react';

import MapEts from 'components/map/MapEts';

import { MapEtsContainer } from 'components/directories/geoobjects/form/form-components/map-geoobject/styled/styled';
import LayerOneGeometry from 'components/directories/geoobjects/form/form-components/map-geoobject/layers/layer-one-geometry/LayerOneGeometry';

import { MapEtsConsumer } from 'components/map/context/MapetsContext';

const makeGeoobjects = (geoobjectData, entity) => {
  const geoobjects: any = {
    [entity]: {
      [`${entity}/${geoobjectData.id}`]: {
        ...geoobjectData,
      },
    },
  };

  Object.values(geoobjects).forEach((geometries) => (
    Object.values(geometries).forEach(({ shape, shape_json, ...data }) => {
      try {
        data.shape = JSON.parse(shape || shape_json);
      } catch (e) {
        data.shape = shape || shape_json;
      }
    })
  ));

  return geoobjects;
};

type PropsMapGeoobjectWrap = {
  geoobjectData: object;
  entity: string;
};

type StateMapGeoobjectWrap = {
};

class MapGeoobjectWrap extends React.PureComponent<PropsMapGeoobjectWrap, StateMapGeoobjectWrap> {
  render() {
    const geoobjects = makeGeoobjects(
      this.props.geoobjectData,
      this.props.entity,
    );

    return (
      <MapEtsConsumer>
        {
          ({ setMapToContext, removeMapToContext }) => (
            <MapEtsContainer>
              <MapEts enableInteractions setMapToContext={setMapToContext} removeMapToContext={removeMapToContext} mapKey="goobjectInfo">
                {
                  ({ map, centerOn }) => (
                    <>
                      <LayerOneGeometry map={map} centerOn={centerOn} geoobjects={geoobjects} />
                    </>
                  )
                }
              </MapEts>
            </MapEtsContainer>
          )
        }
      </MapEtsConsumer>
    );
  }
}

export default MapGeoobjectWrap;
