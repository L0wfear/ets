
import * as React from 'react';

import MapEts from 'components/map/MapEts';

import LayerMissionGeoobject from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/geoobjects/LayerMissionGeoobject';
import LayerCarMarker from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/car-markers/LayerCarMarker';
import LayerTrackLines from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/track/lines/LayerTrackLines';
import LayerTrackPoints from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/track/points/LayerTrackPoints';
import LayerParkingPoints from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/track/events/parking/LayerParkingPoints';

import { PropsMapMissionInfoWrap } from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/MapMissionInfoWrap.h';

import { MapEtsConsumer } from 'components/map/context/MapetsContext';

class MapWrap extends React.PureComponent<PropsMapMissionInfoWrap, {}> {
  render() {
    const { gov_number } = this.props;

    return (
      <MapEtsConsumer>
      {
        ({ setMapToContext, removeMapToContext }) => (
          <MapEts
            enableInteractions
            setMapToContext={setMapToContext}
            removeMapToContext={removeMapToContext}
            mapKey="missionInfoForm"
          >
            {
              ({ map, centerOn }) => (
                <>
                  <LayerMissionGeoobject geoobjects={this.props.geoobjects} map={map} centerOn={centerOn}/>
                  <LayerTrackLines map={map} track={this.props.track} mkad_speed_lim={this.props.mkad_speed_lim} speed_lim={this.props.speed_lim} />
                  <LayerTrackPoints map={map} track={this.props.track} mkad_speed_lim={this.props.mkad_speed_lim} speed_lim={this.props.speed_lim} gov_number={gov_number} cars_sensors={this.props.cars_sensors} missionNumber={this.props.missionNumber}/>
                  <LayerParkingPoints map={map} front_parkings={this.props.parkings} />
                  <LayerCarMarker gov_number={gov_number} map={map}/>
                </>
              )
            }
          </MapEts>
        )
      }
      </MapEtsConsumer>

    );
  }
}
  
export default MapWrap;
