import { PROJECTION, ArcGisLayer } from '../MskAdapter.js';
import { defaultZoom } from 'utils/ol';

export const getView = (props: olx.ViewOptions) => (
  new ol.View(props)
);

export type getMapViewFunc = (
  center: ol.Coordinate,
  zoom: number,
) => ol.View;

export const getMapView: getMapViewFunc = (center, zoom) => (
  getView({
    center,
    zoom,
    minZoom: 2,
    maxZoom: 13,
    projection: PROJECTION,
    extent: PROJECTION.getExtent(),
  })
)

export const getMap = (center, zoom) => (
  new ol.Map({
    view: getMapView(center, zoom),
    controls: [defaultZoom],
    layers: [ArcGisLayer],
    loadTilesWhileAnimating: true,
  })
);

const defaultRetVal = {
  hasChange: false,
  newChnagedStateObj: {},
};

const triggerOnEnableInteractions = (enableInteractions, thisState) => {
  thisState.map.getInteractions().forEach((interaction) => (
    interaction.setActive(enableInteractions)
  ));
}

const checkOnEnableInteractions = ({ enableInteractions }, thisState) => {
  if (enableInteractions !== thisState.enableInteractions) {
    triggerOnEnableInteractions(enableInteractions, thisState);

    return {
      hasChange: true,
      newChnagedStateObj: {
        enableInteractions
      },
    };
  }

  return defaultRetVal;
}

const calcChangedData = (dataArr) => (
  dataArr.reduce((newRetVal, oneData) => ({
    hasChange: newRetVal.hasChange || oneData.hasChange,
    newChnagedStateObj: {
      ...newRetVal.newChnagedStateObj,
      ...oneData.newChnagedStateObj,
    },
  }), defaultRetVal)
)

export const triggerFuncOnComponentWillReceiveProps = (nextProps, thisState) => {
  return calcChangedData(
    [
      defaultRetVal,
      checkOnEnableInteractions(nextProps, thisState),
    ],
  );
};

const checkOnHitByEvent = (map, pixel) => {
  let hasFeatureUndoMouse = false;

  map.forEachFeatureAtPixel(
    pixel,
    (feature) => (
      hasFeatureUndoMouse = !feature.get('notSelected')
    ),
  )

  return hasFeatureUndoMouse;
};

export const mousePointerMove = (eventOl, enableInteractions) => {
  if (enableInteractions) {

    const method = checkOnHitByEvent(eventOl.map, eventOl.pixel) ? 'add' : 'remove';

    eventOl.map.getViewport().classList[method]('pointer');
  }
};

const handleClickOnRowLayer = (eventOl) => (
  eventOl.map.forEachFeatureAtPixel(
    eventOl.pixel,
    (feature, layer) => {
      if (layer.get('singleclick')) {
        layer.get('singleclick')(feature);

        return true;
      }

      return false;
    }
  )
);

export const mouseSingleClick = (eventOl, enableInteractions) => {
  if (enableInteractions) {
    handleClickOnRowLayer(eventOl);
  }
}

export const centerOn = (map: ol.Map, disabledCenterOn, fitProps, noCheckDisabledCenterOn) => {
  if (noCheckDisabledCenterOn || !this.props.disabledCenterOn) {
    const {
      extent,
      opt_options = { padding: [50, 550, 50, 150], maxZoom: 11, duration: 500 },
    } = fitProps;

    map.getView().fit(extent, opt_options);
    return true;
  }

  return false;
};