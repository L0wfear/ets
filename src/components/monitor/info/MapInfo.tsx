import * as React from 'react';
import CarInfoWrap from 'components/monitor/info/car-info/CarInfoWrap';
import GeoobjectsInfoWrap from 'components/monitor/info/geoobjects-info/GeoobjectsInfoWrap';
import IconMeasureAndZoom from 'components/monitor/info/icon-measure-and-zoom/IconMeasureAndZoom';

type PropsMapInfo = {
  map: ol.Map,
  centerOn: any;
};

type StateMapInfo = {

};

class MapInfo extends React.Component<PropsMapInfo, StateMapInfo> {
  render() {
    return (
      <div className="map_info-container">
        <CarInfoWrap {...this.props} />
        <GeoobjectsInfoWrap {...this.props} />
        <IconMeasureAndZoom {...this.props} />
      </div>
    );
  }
}

export default MapInfo;
