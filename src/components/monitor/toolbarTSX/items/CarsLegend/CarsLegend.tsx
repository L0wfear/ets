import * as React from 'react';
import ActiveOption from 'components/monitor/toolbarTSX/items/CarsLegend/Options/ActiveOption';
import InMoveOption from 'components/monitor/toolbarTSX/items/CarsLegend/Options/InMoveOption';
import InHalfStopOption from 'components/monitor/toolbarTSX/items/CarsLegend/Options/InHalfStopOption';
import InStopOption from 'components/monitor/toolbarTSX/items/CarsLegend/Options/InStopOption';
import InNotConnectedOption from 'components/monitor/toolbarTSX/items/CarsLegend/Options/InNotConnectedOption';

import CarsFilterByGovNumber from 'components/monitor/toolbarTSX/items/CarsLegend/CarsFilters/CarsFilterByGovNumber';

const CarsLegend: React.SFC<any> = () => {
  return (
    <div className="cars-legend">
      <div className="legend-wrapper app-toolbar-fill">
        <ActiveOption />
        <InMoveOption />
        <InHalfStopOption />
        <InStopOption />
        <InNotConnectedOption />
      </div>
      <div className="cars-filters" >
        <CarsFilterByGovNumber />
      </div>
    </div>
  );
};

export default CarsLegend;
