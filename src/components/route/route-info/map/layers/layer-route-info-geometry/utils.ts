import { GeoJSON } from 'utils/ol';
import * as ol from 'openlayers';

import {
  TYPES_STYLE,
  inputLineStyleFunc,
  getCasheStyleForGeoobject,
} from 'components/route/route-info/map/layers/layer-route-info-geometry/feature-style';

const renderGeometry= (id, geoobj, thisProps) => {
  if (geoobj.shape) {
    const feature = new ol.Feature({
      geometry: GeoJSON.readGeometry(geoobj.shape),
    });

    feature.setId(id);
    feature.set('state', geoobj.state);
    feature.set('notSelected', !geoobj.name || !geoobj.type);

    thisProps.addFeaturesToSource(feature);

    return feature;
  }

  return null;
}

export const renderGeoobjects = (geoobjectsArr, thisProps) => {
  for (let geoobj of geoobjectsArr) {
    const id = geoobj.object_id;

    const feature = renderGeometry(id, geoobj, thisProps);

    if (feature) {
      feature.setStyle(getCasheStyleForGeoobject(TYPES_STYLE.geoobj, geoobj.state));
    }
  }
};


export const renderInputLines = (geoobjectsArr, thisProps) => {
  for (let geoobj of geoobjectsArr) {
    const id = geoobj.object_id;

    const feature = renderGeometry(id, geoobj, thisProps);

    if (feature) {
      feature.setStyle(inputLineStyleFunc(feature, id));
    }
  }
};
