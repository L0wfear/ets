import * as React from 'react';

import CarFilters from 'components/monitor/new/tool-bar/car-data/car-filters/CarFilters';
import CarLegendStatus from 'components/monitor/new/tool-bar/car-data/car-legend-status/CarLegendStatus';


const BarCarData: React.SFC<{}> = () => (
  <span className="car-toolbar">
    <CarLegendStatus />
    <CarFilters />
  </span>
);

export default BarCarData;
