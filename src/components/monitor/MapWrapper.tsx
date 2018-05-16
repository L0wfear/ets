import * as React from 'react';
import Map from 'components/map/MapNew';

import * as Layers from 'components/map/layers';

const MapWrapper: React.SFC<any> = props =>
  <Map {...props}>
    <Layers.GeoObjectGroup />
    <Layers.TrackGroup />
    <Layers.CarsMarkersLayer />
  </Map>;

export default MapWrapper;
