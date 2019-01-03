import {
  SetMapToContextType,
  RemoveMapToContextType,
} from 'components/new/ui/map/context/MapetsContext.h';

export type StateMapEts = {
  map: ol.Map,
  center: [number, number];
  zoom: number,

  centerOn: any;
  enableInteractions: boolean;
};

export type PropsMapEts = {
  center: [number, number];
  zoom: number,
  enableInteractions: boolean;
  children(props: StateMapEts): React.ReactNode,
  disabledCenterOn?: boolean;
  disabledMousePointerMove?: boolean;
  disabledMouseSingleClick?: boolean;
  disabledMouseMoveend?: boolean;
  setMapToContext: SetMapToContextType;
  removeMapToContext: RemoveMapToContextType;
  mapKey: string;
  rotationAngle?: number;
};

export namespace MapUtils {
  export type getViewFunc = (
    props: ol.olx.ViewOptions,
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

  export type triggerFuncOnNewPRopsInMapEtsFunc = (
    nextProps: PropsMapEts,
    thisState: StateMapEts,
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
      opt_options: ol.olx.view.FitOptions,
    },
    noCheckDisabledCenterOn?: boolean,
  ) => boolean;
}
