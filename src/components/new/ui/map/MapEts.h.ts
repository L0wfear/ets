import Map from 'ol/Map';
import View, { FitOptions, ViewOptions } from 'ol/View';
import { Extent } from 'ol/extent';

import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { SetMapToContextType, RemoveMapToContextType } from 'components/new/ui/map/context/MapetsContext.h';

export type StateMapEts = {
  map: Map;
  center: [number, number];
  zoom: number;

  centerOn: any;
  enableInteractions: boolean;
};

export type StateProps = {
  userData: InitialStateSession['userData'];
  zoom: InitialStateSession['userData']['map_config']['zoom'];
  center: InitialStateSession['userData']['map_config']['coordinates'];
};
export type DispatchProps = {
  dispatch: EtsDispatch;
};

export type OwnProps = {
  enableInteractions: boolean;
  children(props: StateMapEts): React.ReactNode;
  disabledCenterOn?: boolean;
  disabledMousePointerMove?: boolean;
  disabledMouseSingleClick?: boolean;
  disabledMouseMoveend?: boolean;
  setMapToContext: SetMapToContextType;
  removeMapToContext: RemoveMapToContextType;
  mapKey: string;
  rotationAngle?: number;
};

export type PropsMapEts = (
  StateProps
  & DispatchProps
  & OwnProps
);

export namespace MapUtils {
  export type getViewFunc = (
    props: ViewOptions,
  ) => View;

  export type getMapViewFunc = (
    center: Array<number>,
    zoom: number,
  ) => View;

  export type getMapFunc = (
    center: Array<number>,
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
    dataArr: Array<defaultRetValType>,
  ) => defaultRetValType;

  export type triggerFuncOnNewPRopsInMapEtsFunc = (
    nextProps: PropsMapEts,
    thisState: StateMapEts,
  ) => defaultRetValType;

  export type checkOnHitByEventFunc = (
    map: Map,
    pixel: Array<number>,
  ) => boolean;

  export type olEvent = {
    map: Map;
    pixel: Array<number>;
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
      extent: Extent;
      opt_options: FitOptions;
    },
    noCheckDisabledCenterOn?: boolean,
  ) => boolean;
}
