type ISetManualOnTrue = () => void;
type ISetManualOnFalse = () => void;
type iHandleFeatureClick = (any) => void;
type IHandleDrawFeatureAdd = (any) => void;
type IHandleDrawFeatureClick = (any) => void;
type IHandleRemoveLastDrawFeature = () => void;
type IStartDraw = () => void;

export interface IPropsMapInfo {
  focusOnSelectedGeo?: boolean;
  isPermitted: boolean;
  isPermittedMap: boolean;
  manual: boolean;
  polys: any;
  objectsType: 'simple_dt' | 'mixed';
  objectList: any;
  drawObjectList: any;
  startDraw: IStartDraw;
  setManualOnTrue: ISetManualOnTrue;
  setManualOnFalse: ISetManualOnFalse;
  handleFeatureClick: iHandleFeatureClick;
  handleAddDrawLines: IHandleDrawFeatureAdd;
  handleDrawFeatureClick: IHandleDrawFeatureClick;
  handleRemoveLastDrawFeature: IHandleRemoveLastDrawFeature;
}
