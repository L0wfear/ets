import { geoJSON } from 'utils/ol';
import Feature from 'ol/Feature';

import {
  TYPES_STYLE,
  getCasheStyleForGeoobject,
} from 'components/route_new/form/inside_fields/creating-map/map/layers/layer-edit-geoobj-route/feature-style';

const renderGeometry = (id, geoobj, thisProps) => {
  if (geoobj.shape) {
    const feature = new Feature({
      geometry: geoJSON.readGeometry(geoobj.shape),
    });

    feature.setId(id);
    feature.set('state', geoobj.state);

    thisProps.addFeaturesToSource(feature);

    return feature;
  }

  return null;
};

export const renderGeoobjects = (geoobjects, thisProps) => {
  for (const id in geoobjects) {
    if (id in geoobjects) {
      const geoobj = geoobjects[id];

      const feature = renderGeometry(id, geoobj, thisProps);

      if (feature) {
        feature.setStyle(getCasheStyleForGeoobject(TYPES_STYLE.geoobj, geoobj.state));
      }
    }
  }
};
