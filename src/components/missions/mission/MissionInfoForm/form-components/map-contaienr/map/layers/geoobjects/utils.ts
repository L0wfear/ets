import { GeoJSON } from 'utils/ol';
import * as ol from 'openlayers';

import { getCasheStyleForGeoobject } from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/geoobjects/feature-style';
import {
  LayerGeoobjectsUtilsTypes,
} from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/geoobjects/LayerMissionGeoobject.h';

/**
 * изменение геометрии фичи, если shape разный
 * @param geoobj новые данные геообъекта
 * @param geoobj_old старые данные геообъекта
 * @param oldFeature текущая фича геообъекта
 */
const checkShowTrueHasOldFeature: LayerGeoobjectsUtilsTypes.checkShowTrueHasOldFeatureFunc = (geoobj, geoobj_old, oldFeature) => {
  if (geoobj_old.shape !== geoobj.shape && geoobj.shape) {
    oldFeature.setGeometry(GeoJSON.readGeometry(geoobj.shape))
  }
  if (geoobj_old.frontIsSelected !== geoobj.frontIsSelected) {
    oldFeature.setStyle(getCasheStyleForGeoobject(geoobj.frontIsSelected, geoobj.state))
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
    const feature = new ol.Feature({
      geometry: GeoJSON.readGeometry(geoobj.shape),
    });
    feature.setId(id);
    feature.set('serverName', serverName)
    feature.setStyle(getCasheStyleForGeoobject(geoobj.frontIsSelected, geoobj.state));

    thisProps.addFeaturesToSource(feature);
  }
}

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
  for (let serverName in geoobjects) {
    for (let id in geoobjects[serverName]) {
      const oldFeature = thisProps.getFeatureById(id);

      checkShowTrue(serverName, id, geoobjects[serverName][id], geoobjects[serverName][id], oldFeature, thisProps);
    }
  }
}