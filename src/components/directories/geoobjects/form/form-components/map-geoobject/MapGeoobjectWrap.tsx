import * as React from 'react';
import MapEts from 'components/map/new/MapEts';

import { MapEtsContainer } from 'components/directories/geoobjects/form/form-components/map-geoobject/styled/styled';

type PropsMapGeoobjectWrap = {

};

class MapGeoobjectWrap extends React.PureComponent<PropsMapGeoobjectWrap, {}> {
  render() {
    return (
      <MapEtsContainer>
        <MapEts>
          {
            () => {
              <>

              </>
            }
          }
        </MapEts>
      </MapEtsContainer>
    )
  }
}

export default MapGeoobjectWrap;
