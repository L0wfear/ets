import Map from 'ol/Map';
import View, { FitOptions, ViewOptions } from 'ol/View';
import { Extent } from 'ol/extent';

import {
  SetMapToContextType,
  RemoveMapToContextType,
} from 'components/new/ui/map/context/MapetsContext.h';

export type StateMapEts = {
  map: Map,
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
    props: ViewOptions,
  ) => View;

  export type getMapViewFunc = (
    center: number[],
    zoom: number,
  ) => View;

  export type getMapFunc = (
    center: number[],
    zoom?: number,
  ) => Map;

  export type defaultRetValType = {
    hasChange: boolean;
    newChnagedStateObj: {};
  };

  export type triggerOnEnableInteractionsFunc = (
    enableInteractions: boolean,
    map: Map,
  ) => void;

  export type checkOnEnableInteractionsFunc = (
    enableInteractions: boolean,
    enableInteractions_old: boolean,
    map: Map,
  ) => defaultRetValType;

  export type calcChangedDataFunc = (
    dataArr: defaultRetValType[],
  ) => defaultRetValType;

  export type triggerFuncOnNewPRopsInMapEtsFunc = (
    nextProps: PropsMapEts,
    thisState: StateMapEts,
  ) => defaultRetValType;

  export type checkOnHitByEventFunc = (
    map: Map,
    pixel: number[],
  ) => boolean;

  export type olEvent = {
    map: Map;
    pixel: number[];
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
    map: Map,
    disabledCenterOn: boolean,
    fitProps: {
      extent: Extent,
      opt_options: FitOptions,
    },
    noCheckDisabledCenterOn?: boolean,
  ) => boolean;
}
