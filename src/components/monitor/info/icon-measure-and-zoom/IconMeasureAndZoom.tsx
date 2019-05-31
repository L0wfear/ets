import * as React from 'react';
import Map from 'ol/Map';

import LayerPolygonBuffer from 'components/monitor/layers/polygon_buffer/LayerPolygonBuffer';
import LayerMeasure from 'components/monitor/layers/measure/LayerMeasure';
import LayerZoom from 'components/new/ui/map/layers/zoom/Zoom';

type PropsIconMeasureAndZoom = {
  map: Map;
};

class IconMeasureAndZoom extends React.PureComponent<PropsIconMeasureAndZoom, {}> {
  render() {
    return (
      <div className="icon-map-help">
        <LayerZoom map={this.props.map} />
        <LayerMeasure map={this.props.map} />
        <LayerPolygonBuffer map={this.props.map} />
      </div>
    );
  }
}

export default IconMeasureAndZoom;
