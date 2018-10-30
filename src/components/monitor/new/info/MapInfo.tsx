import * as React from 'react';
import CarInfo from 'components/monitor/new/info/car-info/CarInfo';
import GeoobjectsInfo from 'components/monitor/new/info/geoobjects-info/GeoobjectsInfo';
import IconMeasureAndZoom from 'components/monitor/new/info/icon-measure-and-zoom/IconMeasureAndZoom';

type PropsMapInfo = {
  map: ol.Map,
  centerOn: Function;
};

type StateMapInfo = {

};

class MapInfo extends React.Component<PropsMapInfo, StateMapInfo> {
  render() {
    return (
      <div className="map_info-container">
        <CarInfo {...this.props} />
        <GeoobjectsInfo {...this.props} />
        <IconMeasureAndZoom {...this.props} />
      </div>
    )
  }
}


export default MapInfo;
