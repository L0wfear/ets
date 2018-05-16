import * as React from 'react';

import TrackOption from 'components/monitor/toolbarTSX/items/TrackAndGeometryLegend/Options/TrackOption';
import GeometryOption from 'components/monitor/toolbarTSX/items/TrackAndGeometryLegend/Options/GeometryOption';

const CarsLegend: React.SFC<any> = () => {
  return (
    <div className="legend-wrapper app-toolbar-fill">
      <TrackOption />
      <GeometryOption />
    </div>
  );
};

export default CarsLegend;
