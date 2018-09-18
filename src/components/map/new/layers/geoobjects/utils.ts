import { GeoJSON } from 'utils/ol';
import { getCasheStyleForGeoobject } from 'components/map/new/layers/geoobjects/feature-style';
import {
  LayerGeoobjectsUtilsTypes,
} from 'components/map/new/layers/geoobjects/LayerGeooobjects.h';


/**
 * проверка на измнение show в serverName
 * @param serverName serverName геообъекте в стора
 * @param data знаенчие serverName
 * @param show новое значение отображения геообъекта 
 * @param stateData значение serverName в стейте компонента
 */
export const checkShowStatus: LayerGeoobjectsUtilsTypes.checkShowStatusFunc = (serverName, data, show, stateData) => {
  let hasDiff = false;
  const changedGeoobjects = {};

  if (show !== stateData.show) {
    changedGeoobjects[serverName] = {
      show,
      data: data.data,
    };
    hasDiff = true;

    if (!show) {
      changedGeoobjects[serverName].oldData = stateData.data;
    } else {
      changedGeoobjects[serverName].oldData = {};
    }
  }

  return {
    hasDiff,
    changedGeoobjects,
  };
}

/**
 * проверка на измнение data в serverName
 * @param serverName serverName геообъекте в стора
 * @param data знаенчие serverName
 * @param show новое значение отображения геообъекта 
 * @param stateData значение serverName в стейте компонента
 */
export const checkData: LayerGeoobjectsUtilsTypes.checkDataFunc = (serverName, data, show, stateData) => {
  let hasDiff = false;
  const changedGeoobjects = {};

  if (data.data !== stateData.data) {
    hasDiff = true;
    changedGeoobjects[serverName] = {
      show,
      data: data.data,
      oldData: stateData.data,
    };
  }

  return {
    hasDiff,
    changedGeoobjects,
  };
}


/**
 * проверка на дифф состояние serverName
 * @param serverName serverName геообъекте в стора
 * @param data знаенчие serverName
 * @param show новое значение отображения геообъекта 
 * @param stateData значение serverName в стейте компонента
 */
const ansCheck: LayerGeoobjectsUtilsTypes.ansCheck = (serverName, data, show, stateData) => ({
  checkShowStatus: checkShowStatus(serverName, data, show, stateData),
  checkData: checkData(serverName, data, show, stateData),
});


/**
 * 
 * @param retValue изменяемые объект
 * @param serverName serverName геообъекте в стора
 * @param data знаенчие serverName
 * @param show новое значение отображения геообъекта 
 * @param stateData значение serverName в стейте компонента
 */
export const mergeRetvalWithCaclData: LayerGeoobjectsUtilsTypes.mergeRetvalWithCaclDataFunc = (retValue, serverName, data, show, stateData) => {
  const {
    checkShowStatus,
    checkData,
  } = ansCheck(serverName, data, show, stateData);

  return {
    hasDiff: retValue.hasDiff || checkShowStatus.hasDiff || checkData.hasDiff,
    diffGeoobjects: {
      ...retValue.diffGeoobjects,
      ...checkShowStatus.changedGeoobjects,
      ...checkData.changedGeoobjects,
    },
  };
}

/**
 * 
 * @param nextProps следующие пропсы компонента
 * @param thisState текуще состояние компонента
 */
export const diffInputProps: LayerGeoobjectsUtilsTypes.diffInputPropsFunc = (nextProps, thisState) => {
  const { geoobjects, SHOW_GEOOBJECTS } = nextProps;
  let retValue = {
    hasDiff: false,
    diffGeoobjects: {},
  };

  for (let serverName in geoobjects) {
    const data = geoobjects[serverName];

    retValue = mergeRetvalWithCaclData(
      retValue,
      serverName,
      data,
      SHOW_GEOOBJECTS && data.show,
      thisState.geoobjects[serverName],
    );
  }

  return retValue;
}


/**
 * merge изменённых геообъектов в текущие
 * @param geoobjects текущие геообъекты
 * @param diffGeoobjects изменённые геообъекты
 */
export const getMergedGeoobjects: LayerGeoobjectsUtilsTypes.getMergedGeoobjectsFunc = (geoobjects, diffGeoobjects) => ({
  ...Object.entries(geoobjects).reduce((newObj, [serverName, data]) => ({
    ...newObj,
    [serverName]: {
      ...data,
      ...diffGeoobjects[serverName],
    },
  }), {}),
});

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
};

/**
 * добавление фичи в source
 * @param serverName serverName геообъекте в стора
 * @param id id фички в serverName в геообъекте в стора
 * @param geoobj новые данные геообъекта
 * @param thisProps пропсы для добавления фичи в слой
 * @param selected является ли фича выбранной
 */
const checkShowTrueHasNotOldFeature: LayerGeoobjectsUtilsTypes.checkShowTrueHasNotOldFeatureFunc = (serverName, id, geoobj, thisProps, selected, color) => {
  if (geoobj.shape) {
    const feature = new ol.Feature({
      geometry: GeoJSON.readGeometry(geoobj.shape),
    });
    feature.setId(id);
    feature.set('serverName', serverName)
    if (selected) {
      feature.setStyle(getCasheStyleForGeoobject(true));
    } else {
      feature.setStyle(getCasheStyleForGeoobject(false, color));
    }

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
export const checkShowTrue: LayerGeoobjectsUtilsTypes.checkShowTrueFunc = (serverName, id, show, geoobj, geoobj_old, oldFeature, thisProps, selected, isManyCompany) => {
  if (show) {
    if (oldFeature) {
      checkShowTrueHasOldFeature(geoobj, geoobj_old, oldFeature);
    } else {
      checkShowTrueHasNotOldFeature(serverName, id, geoobj, thisProps, selected, isManyCompany && geoobj.front_key.includes('odh') ? thisProps.companiesIndex[geoobj.company_id].rgb_color : '');
    }
  }
};

/**
 * удаление фичи, если она не должна показываться
 * @param show отображается ли фича
 * @param oldFeature текущая фича геообъекта
 * @param thisProps пропсы удаления фичи из source
 */
export const checkShowFalse: LayerGeoobjectsUtilsTypes.checkShowFalseFunc = (show, oldFeature, thisProps) => {
  if (!show && oldFeature) {
    thisProps.removeFeaturesFromSource(oldFeature);
  }
}

/**
 * рендер геообъектов
 * @param geoobjects текущие геообъекты
 * @param diffGeoobjects изменённые геообъекты
 * @param thisProps пропсы для работы с ol
 */
export const renderGeoobjects: LayerGeoobjectsUtilsTypes.renderGeoobjectsFunc = (geoobjects, diffGeoobjects, thisProps) => {
  for (let serverName in diffGeoobjects) {
    const { show, data = {}, oldData = {} } = diffGeoobjects[serverName];
    let iterableData = data || oldData;

    const isManyCompany = Object.values(thisProps.companiesIndex).length > 1;

    for (let id in iterableData) {
      const oldFeature = thisProps.getFeatureById(id);

      checkShowTrue(serverName, id, show, iterableData[id], geoobjects[serverName][id], oldFeature, thisProps, false, isManyCompany);
      checkShowFalse(show, oldFeature, thisProps);
    }
  }
}