import * as React from 'react';

import DtGeoObjectOl from 'components/map/layers/GeoObjects/DtGeoObjectOl';
import OdhGeoObjectOl from 'components/map/layers/GeoObjects/OdhGeoObjectOl';
import SspGeoObjectOl from 'components/map/layers/GeoObjects/SspGeoObjectOl';
import MspGeoObjectOl from 'components/map/layers/GeoObjects/MspGeoObjectOl';
import CarpoolGeoObjectOl from 'components/map/layers/GeoObjects/CarpoolGeoObjectOl';
import FuelingWaterGeoObjectOl from 'components/map/layers/GeoObjects/FuelingWaterGeoObjectOl';
import DangerZoneGeoObjectOl from 'components/map/layers/GeoObjects/DangerZoneGeoObjectOl';
import PgmStoreGeoObjectOl from 'components/map/layers/GeoObjects/PgmStoreGeoObjectOl';
import SnowStorageGeoObjectOl from 'components/map/layers/GeoObjects/SnowStorageGeoObjectOl';
import BridgesGeoObjectOl from 'components/map/layers/GeoObjects/BridgesGeoObjectOl';
import PedestrianTunnelsGeoObjectOl from 'components/map/layers/GeoObjects/PedestrianTunnelsGeoObjectOl';
import PedestrianTunnelExitsGeoObjectOl from 'components/map/layers/GeoObjects/PedestrianTunnelExitsGeoObjectOl';
import FountainsGeoObjectOl from 'components/map/layers/GeoObjects/FountainsGeoObjectOl';

const GeoObjectGroup: React.SFC<any> = props =>
  <div>
    <DtGeoObjectOl { ...props }/>
    <OdhGeoObjectOl { ...props } />
    <SspGeoObjectOl { ...props } />
    <MspGeoObjectOl { ...props } />
    <CarpoolGeoObjectOl { ...props } />
    <FuelingWaterGeoObjectOl { ...props } />
    <DangerZoneGeoObjectOl { ...props } />
    <PgmStoreGeoObjectOl { ...props } />
    <SnowStorageGeoObjectOl { ...props } />
    <BridgesGeoObjectOl { ...props } />
    <PedestrianTunnelsGeoObjectOl { ...props } />
    <PedestrianTunnelExitsGeoObjectOl { ...props } />
    <FountainsGeoObjectOl { ...props } />
  </div>;

export default GeoObjectGroup;

