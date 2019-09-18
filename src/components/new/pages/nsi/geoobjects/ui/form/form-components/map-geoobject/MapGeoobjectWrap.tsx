import * as React from 'react';

import MapEts from 'components/new/ui/map/MapEts';

import { MapEtsContainer } from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/styled/styled';
import LayerOneGeometry from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/layers/layer-one-geometry/LayerOneGeometry';

import { MapEtsConsumer } from 'components/new/ui/map/context/MapetsContext';

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

const MapGeoobjectWrap: React.FC<PropsMapGeoobjectWrap> = React.memo(
  (props) => {
    const geoobjects = makeGeoobjects(
      props.geoobjectData,
      props.entity,
    );

    return (
      <MapEtsConsumer>
        {
          ({ setMapToContext, removeMapToContext }) => (
            <MapEtsContainer>
              <MapEts enableInteractions setMapToContext={setMapToContext} removeMapToContext={removeMapToContext} mapKey="goobjectInfo">
                {
                  ({ map, centerOn }) => (
                    <LayerOneGeometry map={map} centerOn={centerOn} geoobjects={geoobjects} />
                  )
                }
              </MapEts>
            </MapEtsContainer>
          )
        }
      </MapEtsConsumer>
    );
  },
);

export default MapGeoobjectWrap;
