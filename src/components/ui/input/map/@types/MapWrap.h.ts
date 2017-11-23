export type ICoordindate = [number, number];

export interface IOneobject {
  name: string;
  object_id?: number;
  state?: number;
  type?: 'odh' | 'dt';
  coordinates?: ICoordindate;
}

export interface ICoorXY {
  x_msk: number;
  y_msk: number;
}
export interface IOneDrawObject {
  begin: ICoorXY;
  distance: number;
  end: ICoorXY;
  id: number;
  state: number;
}

export type ICoordindateByPolygon = ICoordindate[];

export type ICoordinateArray = ICoordindateByPolygon[];

export interface IShapePoly {
  coordinates: ICoordinateArray;
  type: 'Polygon' | 'MultiPolygon' | 'LineString';
}
export interface IOnePoly {
  name: string;
  shape: IShapePoly;
  state: number;
}

export interface IPolysArray {
  [name: number]: IOnePoly;
}

export interface IPropsHandleFeatureClick {
  id: number | string;
  name: string;
  nextState: number;
}

export interface IPointObject {
  coordinates: ICoordindate;
  name: string;
}

export interface IPropsHandlePointAdd {
  newPointObject: IPointObject;
}
export interface IPropsHandleDrawFeatureAdd {
  drawObjectNew: IOneDrawObject;
}
export interface IPropsIHandleDrawFeatureClick {
  index: number;
  nextState: number;
}
export type IObjectsType = 'mixed' | 'simple_dt' | 'points';
export type IObjectList = IOneobject[];
export type IHandleFeatureClick = (obj: IPropsHandleFeatureClick) => void;
export type IHandlePointAdd = (obj: IPropsHandlePointAdd) => void;
export type IHandleDrawFeatureAdd = (obj: IPropsHandleDrawFeatureAdd) => void;
export type IHandleDrawFeatureClick = (obj: IPropsIHandleDrawFeatureClick) => void;
export type IHandleRemoveLastDrawFeature = () => void;
export type IPolys = object | IPolysArray;
export type IDrawObjectList = IOneDrawObject[];

export interface IMapWrapProps {
  objectsType: IObjectsType;
  objectList: IObjectList;
  handleFeatureClick: IHandleFeatureClick;
  handlePointAdd: IHandlePointAdd;
  handleDrawFeatureAdd: IHandleDrawFeatureAdd;
  handleDrawFeatureClick: IHandleDrawFeatureClick;
  handleRemoveLastDrawFeature: IHandleRemoveLastDrawFeature;
  polys?: IPolys;
  drawObjectList?: IDrawObjectList;
  manual?: boolean;
}

export interface IMapWrapState {
  zoom: number;
  center: ICoordindate;
}
