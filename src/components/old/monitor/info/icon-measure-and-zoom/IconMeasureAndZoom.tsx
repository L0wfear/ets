import * as React from 'react';
import Map from 'ol/Map';

import LayerPolygonBuffer from 'components/monitor/layers/polygon_buffer/LayerPolygonBuffer';
import LayerMeasure from 'components/monitor/layers/measure/LayerMeasure';
import LayerZoom from 'components/new/ui/map/layers/zoom/Zoom';
import { IconMapHelp } from './styled';

type PropsIconMeasureAndZoom = {
  map: Map;
};

const IconMeasureAndZoom: React.FC<PropsIconMeasureAndZoom> = React.memo(
  (props) => {
    return (
      <IconMapHelp>
        <LayerZoom map={props.map} />
        <LayerMeasure map={props.map} />
        <LayerPolygonBuffer map={props.map} />
      </IconMapHelp>
    );
  },
);

export default IconMeasureAndZoom;
