export type StateMap = {
  map: ol.Map,
  center: [number, number];
  zoom: number,

  centerOn: Function;
  enableInteractions: boolean;
};

export type PropsMap = {
  center: [number, number];
  zoom: number,
  enableInteractions: boolean;
  children(props: StateMap): React.ReactNode,
  disabledCenterOn?: boolean;
  disabledMousePointerMove?: boolean;
  disabledMouseSingleClick?: boolean;
  disabledMouseMoveend?: boolean;
  disabledouseSingleClick?: boolean;
};

export module MapUtils {
  export type getViewFunc = (
    props: olx.ViewOptions,
  ) => ol.View;

  export type getMapViewFunc = (
    center: ol.Coordinate,
    zoom: number,
  ) => ol.View;

  export type getMapFunc = (
    center: ol.Coordinate,
    zoom?: number,
  ) => ol.Map;

  export type defaultRetValType = {
    hasChange: boolean;
    newChnagedStateObj: {};
  };

  export type triggerOnEnableInteractionsFunc = (
    enableInteractions: boolean,
    map: ol.Map,
  ) => void;

  export type checkOnEnableInteractionsFunc = (
    enableInteractions: boolean,
    enableInteractions_old: boolean,
    map: ol.Map,
  ) => defaultRetValType;

  export type calcChangedDataFunc = (
    dataArr: defaultRetValType[],
  ) => defaultRetValType;

  export type triggerFuncOnComponentWillReceivePropsFunc = (
    nextProps: PropsMap,
    thisState: StateMap,
  ) => defaultRetValType;

  export type checkOnHitByEventFunc = (
    map: ol.Map,
    pixel: ol.Pixel,
  ) => boolean;

  export type olEvent = {
    map: ol.Map;
    pixel: ol.Pixel;
  };

  export type mousePointerMoveFunc = (
    eventOl: olEvent,
    disabledMouseSingleClick: boolean,
  ) => void;

  export type handleClickOnRowLayerFunc = (
    eventOl: olEvent,
  ) => void;

  export type mouseSingleClickFunc = (
    eventOl: olEvent,
    disabledMouseSingleClick: boolean,
  ) => void;

  export type centerOnFunc = (
    map: ol.Map,
    disabledCenterOn: boolean,
    fitProps: {
      extent: ol.Extent,
      opt_options: olx.view.FitOptions,
    },
    noCheckDisabledCenterOn?: boolean,
  ) => boolean;
}
