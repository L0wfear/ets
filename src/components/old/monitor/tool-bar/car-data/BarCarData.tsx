import * as React from 'react';

import CarFilters from 'components/old/monitor/tool-bar/car-data/car-filters/CarFilters';
import CarLegendStatus from 'components/old/monitor/tool-bar/car-data/car-legend-status/CarLegendStatus';

const BarCarData: React.FC<{}> = () => (
  <span className="car-toolbar">
    <CarLegendStatus />
    <CarFilters />
  </span>
);

export default BarCarData;
