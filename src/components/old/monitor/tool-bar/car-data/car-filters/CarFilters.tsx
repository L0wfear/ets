import * as React from 'react';
import CarFilterByText from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-text/CarFilterByText';
import CarFilterBySelect from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/CarFilterBySelect';
import CarFilterByGeoobject from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-geoobject/CarFilterBySelect';

type CarFiltersProps = {};

const CarFilters: React.FC<CarFiltersProps> = () => (
  <span className="car_filters-container-wrap">
    <span className="car_filters-container">
      <CarFilterByText />
      <CarFilterByGeoobject />
      <CarFilterBySelect />
    </span>
  </span>
);

export default CarFilters;
