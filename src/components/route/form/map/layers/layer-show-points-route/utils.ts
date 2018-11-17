import { geoJSON } from 'utils/ol';
import Feature from 'ol/Feature';

import {
  TYPES_STYLE,
  getCasheStyleForGeoobject,
} from 'components/route/form/map/layers/layer-show-points-route/feature-style';

const renderGeometry = (id, geoobj, thisProps) => {
  if (geoobj.shape) {
    const feature = new Feature({
      geometry: geoJSON.readGeometry(geoobj.shape),
    });

    feature.setId(id);
    feature.set('notSelected', true);

    thisProps.addFeaturesToSource(feature);

    return feature;
  }

  return null;
};

export const renderGeoobjects = (objectList, thisProps) => {
  for (const geoobj of objectList) {
    const id = geoobj.frontId;
    const feature = renderGeometry(id, geoobj, thisProps);

    if (feature) {
      feature.setStyle(getCasheStyleForGeoobject(TYPES_STYLE.geoobj));
    }
  }
};
