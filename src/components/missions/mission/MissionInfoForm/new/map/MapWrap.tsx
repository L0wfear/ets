import * as React from 'react';

import Map from 'components/map/new/Map';

import LayerGeooobjects from 'components/missions/mission/MissionInfoForm/new/map/layers/geoobjects/LayerGeooobjects';
import LayerCarMarker from 'components/missions/mission/MissionInfoForm/new/map/layers/car-markers/LayerCarMarker';
import LayerTrackLines from 'components/missions/mission/MissionInfoForm/new/map/layers/track/lines/LayerTrackLines';

type PropsMapWrap = {
  gov_number: string;
  geoobjects: object;

  speed_lim: number;
  mkad_speed_lim: number;
  track: any[];
};

class MapWrap extends React.Component<PropsMapWrap, {}> {
  render() {
    return (
      <Map enableInteractions>
        {
          ({ map, zoom, centerOn }) => (
            <div>
              {
               
                /*
                <LayerTrackPoints map={map} />
                <LayerParkingPoints map={map} />
                <Legend hasMkad MaxSpeeds />

                */
              }
              <LayerGeooobjects geoobjects={this.props.geoobjects} map={map} centerOn={centerOn}/>
              <LayerTrackLines map={map} track={this.props.track} mkad_speed_lim={this.props.mkad_speed_lim} speed_lim={this.props.speed_lim} />
              <LayerCarMarker gov_number={this.props.gov_number} map={map}/>
            </div>
          )
        }
      </Map>
    );
  }
}
  
export default MapWrap;
