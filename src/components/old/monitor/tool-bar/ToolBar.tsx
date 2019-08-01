import * as React from 'react';

import BarCarData from 'components/old/monitor/tool-bar/car-data/BarCarData';
import BarGeoobjectLegend from 'components/old/monitor/tool-bar/geoobject-legend/BarGeoobjectLegend';
import BarShowGovNumber from 'components/old/monitor/tool-bar/show-gov-number/BarShowGovNumber';
import BarShowGeoobjects from 'components/old/monitor/tool-bar/show-geoobjects/BarShowGeoobjects';
import FuelLeak from 'components/old/monitor/tool-bar/fuel-leak/FuelLeak';
import BarCompanyColor from 'components/old/monitor/tool-bar/show-company-color/BarCompanyColor';

const ToolBar: React.FC<{}> = () => (
  <div className="tool_bar-wrap">
    <div className="tool_bar">
      <BarCarData />
      <BarGeoobjectLegend />
      <BarShowGovNumber />
      <BarShowGeoobjects />
      <FuelLeak />
      <BarCompanyColor />
    </div>
  </div>
);

export default ToolBar;
