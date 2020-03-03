import { PROJECTION, getArcGisLayer } from 'components/new/ui/map/config/MskAdapter';
import { MapUtils } from 'components/new/ui/map/MapEts.h';
import View from 'ol/View';
import Map from 'ol/Map';

/**
 * получние mapView
 * @param center начальный центр карты
 * @param zoom начальный зум
 */
export const getMapView: MapUtils.getMapViewFunc = (center, zoom) => (
  new View({
    center,
    zoom,
    minZoom: 2,
    maxZoom: 13,
    projection: PROJECTION,
    extent: PROJECTION.getExtent(),
  })
);

/**
 * получние map
 * @param center начальный центр карты
 * @param zoom начальный зум
 */
export const getMap: MapUtils.getMapFunc = (center, zoom) => (
  new Map({
    view: getMapView(center, zoom),
    controls: [],
    layers: [getArcGisLayer()],
  })
);

/**
 * начальное значение возвращаемого значение
 */
const defaultRetVal: MapUtils.defaultRetValType  = {
  hasChange: false,
  newChnagedStateObj: {},
};

/**
 * включение/ выключение всей интерактивности
 * @param enableInteractions доступна ли интерактивность
 * @param map карта
 */
const triggerOnEnableInteractions: MapUtils.triggerOnEnableInteractionsFunc = (enableInteractions, map) => {
  map.getInteractions().forEach((interaction) => (
    interaction.setActive(enableInteractions)
  ));
};

/**
 * триггер при зименении интерактивности
 * @param enableInteractions доступна ли интерактивность
 * @param enableInteractions_old доступна ли интерактивность в прошлом состоянии
 * @param map карта
 */
const checkOnEnableInteractions: MapUtils.checkOnEnableInteractionsFunc = (enableInteractions, enableInteractions_old, map) => {
  if (enableInteractions !== enableInteractions_old) {
    triggerOnEnableInteractions(enableInteractions, map);

    return {
      hasChange: true,
      newChnagedStateObj: {
        enableInteractions,
      },
    };
  }

  return defaultRetVal;
};

/**
 * merge всех "триггернутых" значение
 * @param dataArr массив всех "триггернутых" значение
 */
const calcChangedData: MapUtils.calcChangedDataFunc  = (dataArr) => (
  dataArr.reduce((newRetVal, oneData) => ({
    hasChange: newRetVal.hasChange || oneData.hasChange,
    newChnagedStateObj: {
      ...newRetVal.newChnagedStateObj,
      ...oneData.newChnagedStateObj,
    },
  }), defaultRetVal)
);

/**
 * триггер на получение пропсов карты
 * @param nextProps следующие пропсы компонента карты
 * @param thisState текущее состояние компонента карты
 */
export const triggerFuncOnNewPRopsInMapEts: MapUtils.triggerFuncOnNewPRopsInMapEtsFunc = (nextProps, thisState) => {
  return calcChangedData(
    [
      defaultRetVal,
      checkOnEnableInteractions(
        nextProps.enableInteractions,
        thisState.enableInteractions,
        thisState.map,
      ),
    ],
  );
};

/**
 * проверка всех фич в пикселе на возможность выбора
 * @param map карта
 * @param pixel пиксель события
 */
const checkOnHitByEvent: MapUtils.checkOnHitByEventFunc = (map, pixel) => {
  let hasFeatureUndoMouse = false;

  map.forEachFeatureAtPixel(
    pixel,
    (feature) => (
      hasFeatureUndoMouse = !feature.get('notSelected')
    ),
  );

  return hasFeatureUndoMouse;
};

/**
 * хенлер движения мыши по карте
 * @param eventOl ol событие
 * @param enableInteractions доступна ли интерактивность
 */
export const mousePointerMove: MapUtils.mousePointerMoveFunc = (eventOl, disabledMouseSingleClick) => {
  if (disabledMouseSingleClick) {

    const method = checkOnHitByEvent(eventOl.map, eventOl.pixel) ? 'add' : 'remove';

    eventOl.map.getViewport().classList[method]('pointer');
  }
};

/**
 * поиск слоя и клик по нему
 * @param eventOl ol событие
 */
const handleClickOnRowLayer: MapUtils.handleClickOnRowLayerFunc = (eventOl) => (
  eventOl.map.forEachFeatureAtPixel(
    eventOl.pixel,
    (feature, layer) => {
      if (layer && layer.get('singleclick')) {
        layer.get('singleclick')(feature, eventOl);

        return true;
      }

      return false;
    },
  )
);

/**
 * хендлер на клик на карте
 * @param eventOl ol событие
 * @param enableInteractions доступна ли интерактивность
 */
export const mouseSingleClick: MapUtils.mouseSingleClickFunc = (eventOl, disabledMouseSingleClick) => {
  if (disabledMouseSingleClick) {
    handleClickOnRowLayer(eventOl);
  }
};

/**
 * центрирование карты по координатам
 * @param map ol карта
 * @param disabledCenterOn задисейблено ли центрирование
 * @param fitProps пропсы для map.fit
 * @param noCheckDisabledCenterOn игнорирование дисейбла
 */
export const centerOn: MapUtils.centerOnFunc = (map: Map, disabledCenterOn, fitProps, noCheckDisabledCenterOn) => {
  if (noCheckDisabledCenterOn || !disabledCenterOn) {
    const {
      extent,
      opt_options = { padding: [50, 550, 50, 150], maxZoom: 11, duration: 500 },
    } = fitProps;
    try {
      setTimeout(() => {
        map.getView().fit(extent, opt_options);
      }, 100);
    } catch (e) {
      console.info('no fit'); // eslint-disable-line
    }
    return true;
  }

  return false;
};
