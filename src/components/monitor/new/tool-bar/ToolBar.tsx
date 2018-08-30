import * as React from 'react';

import BarCarData from 'components/monitor/new/tool-bar/car-data/BarCarData';
import BarGeoobjectLegend from 'components/monitor/new/tool-bar/geoobject-legend/BarGeoobjectLegend';
import BarShowGovNumber from 'components/monitor/new/tool-bar/show-gov-number/BarShowGovNumber';
import BarShowGeoobjects from 'components/monitor/new/tool-bar/show-geoobjects/BarShowGeoobjects';
import FuelLeak from 'components/monitor/new/tool-bar/fuel-leak/FuelLeak';
import BarCompanyColor from 'components/monitor/new/tool-bar/show-company-color/BarCompanyColor';

const ToolBar: React.SFC<{}> = () => (
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
