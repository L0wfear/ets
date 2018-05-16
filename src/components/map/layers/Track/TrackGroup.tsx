import * as React from 'react';
import LineLayer from 'components/map/layers/Track/LineLayer';
import MarkersLayer from 'components/map/layers/Track/big_zoom/MarkersLayer';
import ParkingMarkersLayer from 'components/map/layers/Track/big_zoom/ParkingMarkersLayer';
import FuelEventMarker from 'components/map/layers/Track/big_zoom/FuelEventMarkersLayer';

const Group: React.SFC<any> = props => {
  return (
    <div>
      <LineLayer { ...props } />
      <MarkersLayer { ...props } />
      <ParkingMarkersLayer {...props } />
      <FuelEventMarker { ...props } />
    </div>
  );
};

export default Group;
