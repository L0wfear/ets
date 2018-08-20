import * as React from 'react';

import TitleTrackTab from 'components/monitor/new/info/car-info/car-tab-menu/car-track-information/title-track-tab/TitleTrackTab';
import ActionTrackTab from 'components/monitor/new/info/car-info/car-tab-menu/car-track-information/action-track-tab/ActionTrackTab';
import SensorsTrackTab from 'components/monitor/new/info/car-info/car-tab-menu/car-track-information/sensors-track-tab/SensorsTrackTab';

type PropsCarTrackInformation = {
  map: ol.Map;
};

const CarTrackInformation: React.SFC<PropsCarTrackInformation> = props => (
  <div>
    <TitleTrackTab />
    <ActionTrackTab />
    <SensorsTrackTab />
  </div>
)

export default CarTrackInformation;
