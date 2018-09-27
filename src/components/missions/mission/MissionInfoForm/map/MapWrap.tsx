import * as React from 'react';

import Map from 'components/map/new/Map';

import LayerGeooobjects from 'components/missions/mission/MissionInfoForm/map/layers/geoobjects/LayerGeooobjects';
import LayerCarMarker from 'components/missions/mission/MissionInfoForm/map/layers/car-markers/LayerCarMarker';
import LayerTrackLines from 'components/missions/mission/MissionInfoForm/map/layers/track/lines/LayerTrackLines';
import LayerTrackPoints from 'components/missions/mission/MissionInfoForm/map/layers/track/points/LayerTrackPoints';
import LayerParkingPoints from 'components/missions/mission/MissionInfoForm/map/layers/track/events/parking/LayerParkingPoints';

type PropsMapWrap = {
  gov_number: string;
  geoobjects: object;

  speed_lim: number;
  mkad_speed_lim: number;
  track: any[];
  parkings: any[];
  cars_sensors: object;
  missionNumber: string | number;
};

class MapWrap extends React.Component<PropsMapWrap, {}> {
  render() {
    const { gov_number } = this.props;

    return (
      <Map enableInteractions>
        {
          ({ map, zoom, centerOn }) => (
            <>
              <LayerGeooobjects geoobjects={this.props.geoobjects} map={map} centerOn={centerOn}/>
              <LayerTrackLines map={map} track={this.props.track} mkad_speed_lim={this.props.mkad_speed_lim} speed_lim={this.props.speed_lim} />
              <LayerTrackPoints map={map} track={this.props.track} mkad_speed_lim={this.props.mkad_speed_lim} speed_lim={this.props.speed_lim} gov_number={gov_number} cars_sensors={this.props.cars_sensors} missionNumber={this.props.missionNumber}/>
              <LayerParkingPoints map={map} front_parkings={this.props.parkings} />
              <LayerCarMarker gov_number={gov_number} map={map}/>
            </>
          )
        }
      </Map>
    );
  }
}
  
export default MapWrap;
