import { geoJSON } from 'utils/ol';
import Feature from 'ol/Feature';
import { get } from 'lodash';

import { getCasheStyleForGeoobject } from 'components/old/reports/operational/track_events/form/map-geoobject/layers/layer-one-geometry/feature-style';
import { LayerGeoobjectsUtilsTypes } from 'components/old/reports/operational/track_events/form/map-geoobject/layers/layer-one-geometry/LayerOneGeometry.h';

/**
 * изменение геометрии фичи, если shape разный
 * @param geoobj новые данные геообъекта
 * @param geoobj_old старые данные геообъекта
 * @param oldFeature текущая фича геообъекта
 */
const checkShowTrueHasOldFeature: LayerGeoobjectsUtilsTypes.checkShowTrueHasOldFeatureFunc = (geoobj, geoobj_old, oldFeature) => {
  const oldShape = get(geoobj_old, ['shape'], null);
  if (oldShape !== geoobj.shape && geoobj.shape) {
    oldFeature.setGeometry(geoJSON.readGeometry(geoobj.shape));
  }
  if (geoobj_old.frontIsSelected !== geoobj.frontIsSelected) {
    oldFeature.setStyle(getCasheStyleForGeoobject(geoobj.frontIsSelected, geoobj.state));
  }
};

/**
 * добавление фичи в source
 * @param serverName serverName геообъекте в стора
 * @param id id фички в serverName в геообъекте в стора
 * @param geoobj новые данные геообъекта
 * @param thisProps пропсы для добавления фичи в слой
 * @param selected является ли фича выбранной
 */
const checkShowTrueHasNotOldFeature: LayerGeoobjectsUtilsTypes.checkShowTrueHasNotOldFeatureFunc = (serverName, id, geoobj, thisProps) => {
  if (geoobj.shape) {
    const feature = new Feature({
      geometry: geoJSON.readGeometry(geoobj.shape),
    });
    feature.setId(id);
    feature.set('serverName', serverName);
    feature.setStyle(getCasheStyleForGeoobject(geoobj.frontIsSelected, geoobj.state));

    thisProps.addFeaturesToSource(feature);
  }
};

/**
 * действия, если фича должна отображается
 * @param serverName serverName геообъекте в стора
 * @param id id фички в serverName в геообъекте в стора
 * @param show должна ли фича отображаться
 * @param geoobj новые данные геообъекта
 * @param geoobj_old старые данные геообъекта
 * @param oldFeature текущая фича геообъекта
 * @param thisProps пропсы для добавления фичи в слой
 * @param selected является ли фича выбранной
 */
export const checkShowTrue: LayerGeoobjectsUtilsTypes.checkShowTrueFunc = (serverName, id, geoobj, geoobj_old, oldFeature, thisProps) => {
  if (oldFeature) {
    checkShowTrueHasOldFeature(geoobj, geoobj_old, oldFeature);
  } else {
    checkShowTrueHasNotOldFeature(serverName, id, geoobj, thisProps);
  }
};

/**
 * рендер геообъектов
 * @param geoobjects текущие геообъекты
 * @param diffGeoobjects изменённые геообъекты
 * @param thisProps пропсы для работы с ol
 */
export const renderGeoobjects: LayerGeoobjectsUtilsTypes.renderGeoobjectsFunc = (geoobjects, thisProps) => {
  for (const serverName in geoobjects) {
    if (serverName in geoobjects) {
      for (const id in geoobjects[serverName]) {
        if (id in geoobjects[serverName]) {
          const oldFeature = thisProps.getFeatureById(id);

          checkShowTrue(serverName, id, geoobjects[serverName][id], geoobjects[serverName][id], oldFeature, thisProps);
        }
      }
    }
  }
};
