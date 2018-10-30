import * as React from 'react';
import LayerMeasure from 'components/map/new/layers/measure/LayerMeasure';
import LayerZoom from 'components/map/new/layers/zoom/Zoom';

type PropsIconMeasureAndZoom = {
  map: ol.Map;
};

class IconMeasureAndZoom extends React.Component<PropsIconMeasureAndZoom, {}> {
  render() {
    return (
      <div className="icon-map-help">
        <LayerZoom map={this.props.map} />
        <LayerMeasure map={this.props.map} />
      </div>
    );
  }
}

export default IconMeasureAndZoom;
