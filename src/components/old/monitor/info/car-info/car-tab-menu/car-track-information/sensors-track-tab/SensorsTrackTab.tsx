import * as React from 'react';

import SensorsEquipmentList from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/sensors-track-tab/equipment/SensorsEquipmentList';
import SensorsLevelList from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/sensors-track-tab/level/SensorsLevelList';
import { CarInfoBlockTabDataColumn } from 'components/old/monitor/styled';
import { CarInfoTrackDateTitle } from 'components/old/monitor/info/geoobjects-info/styled';

type PropsSensorsTrackTab = {
};

const SensorsTrackTab: React.FC<PropsSensorsTrackTab> = () => (
  <CarInfoBlockTabDataColumn>
    <CarInfoTrackDateTitle>
      <div>Отображение датчиков на треке</div>
    </CarInfoTrackDateTitle>
    <div className="car_info-sensors-list-container">
      <div className="sensors-type-list">
        <div className="type-title" >Датчики уровня топлива</div>
        <SensorsLevelList />
      </div>
      <div className="sensors-type-list">
        <div className="type-title" >Датчики навесного оборудования</div>
        <SensorsEquipmentList />
      </div>
    </div>
  </CarInfoBlockTabDataColumn>
);

export default SensorsTrackTab;
