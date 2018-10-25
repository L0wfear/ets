import { GeoJSON } from 'utils/ol';
import Feature from 'ol/Feature';

import {
  TYPES_STYLE,
  inputLineStyleFunc,
  getCasheStyleForGeoobject,
} from 'components/route/form/map/layers/layer-edit-draw-route/feature-style';

const renderGeometry= (id, geoobj, thisProps) => {
  if (geoobj.shape) {
    const feature = new Feature({
      geometry: GeoJSON.readGeometry(geoobj.shape),
    });

    feature.setId(id);
    feature.set('state', geoobj.state);

    thisProps.addFeaturesToSource(feature);

    return feature;
  }

  return null;
}

export const renderGeoobjects = (geoobjects, thisProps) => {
  for (let id in geoobjects) {
    const geoobj = geoobjects[id];

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
