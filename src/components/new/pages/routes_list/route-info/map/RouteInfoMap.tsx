import * as React from 'react';
import memoize from 'memoize-one';

import MapEts from 'components/new/ui/map/MapEts';

import { MapEtsContainer } from 'components/new/pages/routes_list/route-info/map/styled/styled';

import {
  PropsMapGeoobjectWrap,
  StateMapGeoobjectWrap,
} from 'components/new/pages/routes_list/route-info/map/RouteInfoMap.h';

import LayerRouteInfoGeometry from 'components/new/pages/routes_list/route-info/map/layers/layer-route-info-geometry/LayerRouteInfoGeometry';
import { isNumber } from 'util';

import { MapEtsConsumer } from 'components/new/ui/map/context/MapetsContext';

const makeObjectListWithShape = (object_list) => (
  object_list.map((data) => ({
    ...data,
    object_id: isNumber(data.frontId) || data.frontId ? data.frontId : data.object_id,
    shape: data.shape || null,
  }))
);

class MapGeoobjectWrap extends React.PureComponent<PropsMapGeoobjectWrap, StateMapGeoobjectWrap> {
  makeObjectListWithShape = (
    memoize(
      makeObjectListWithShape,
    )
  );

  render() {
    const { props } = this;

    const objectList = this.makeObjectListWithShape(this.props.object_list);

    return (
      <MapEtsContainer width={props.width} height={props.height}>
        <MapEtsConsumer>
          {
            ({ setMapToContext, removeMapToContext }) => (
              <MapEts
                enableInteractions
                setMapToContext={setMapToContext}
                removeMapToContext={removeMapToContext}
                mapKey={this.props.mapKey}
                rotationAngle={this.props.rotationAngle}
              >
                {
                  ({ map, centerOn }) => (
                    <>
                      <LayerRouteInfoGeometry
                        map={map}
                        centerOn={centerOn}
                        geoobjectsArr={objectList}
                        inputLines={this.props.input_lines}
                      />
                    </>
                  )
                }
              </MapEts>
            )
          }
        </MapEtsConsumer>
      </MapEtsContainer>
    );
  }
}

export default MapGeoobjectWrap;
