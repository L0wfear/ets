import * as React from 'react';

import SensorsEquipmentList from 'components/monitor/info/car-info/car-tab-menu/car-track-information/sensors-track-tab/equipment/SensorsEquipmentList';
import SensorsLevelList from 'components/monitor/info/car-info/car-tab-menu/car-track-information/sensors-track-tab/level/SensorsLevelList';

type PropsSensorsTrackTab = {
};

const SensorsTrackTab: React.FC<PropsSensorsTrackTab> = () => (
  <div className="car_info_block column tab-data">
    <div className="car_info-track_date_title">
      <div>Отображение датчиков на треке</div>
    </div>
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
  </div>
);

export default SensorsTrackTab;
