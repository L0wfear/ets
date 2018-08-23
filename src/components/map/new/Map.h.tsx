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
  children(props: StateMap): JSX.Element,
  disabledCenterOn?: boolean;
  disabledMousePointerMove?: boolean;
  disabledMouseSingleClick?: boolean;
  disabledMouseMoveend?: boolean;
};