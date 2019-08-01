import * as React from 'react';
import Map from 'ol/Map';

import TitleTrackTab from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/TitleTrackTab';
import ActionTrackTab from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/action-track-tab/ActionTrackTab';
import SensorsTrackTab from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/sensors-track-tab/SensorsTrackTab';

type PropsCarTrackInformation = {
  map: Map;
};

const CarTrackInformation: React.FC<PropsCarTrackInformation> = React.memo(
  () => (
    <div>
      <TitleTrackTab />
      <ActionTrackTab />
      <SensorsTrackTab />
    </div>
  ),
);

export default CarTrackInformation;
