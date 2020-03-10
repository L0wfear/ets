type ISetManualOnTrue = () => void;
type ISetManualOnFalse = () => void;
type iHandleFeatureClick = (any) => void;
type IHandleDrawFeatureAdd = (any) => void;
type IHandleDrawFeatureClick = (any) => void;
type IHandleRemoveTargetDrawFeature = () => void;
type IStartDraw = () => void;

export type IPropsMapInfo = {
  focusOnSelectedGeo?: boolean;
  isPermitted: boolean;
  isPermittedMap: boolean;
  manual: boolean;
  isNotDrawAllObject?: boolean;
  polys: any;
  objectsType: 'simple_dt' | 'mixed';
  objectList: any;
  drawObjectList: any;
  startDraw: IStartDraw;
  setManualOnTrue: ISetManualOnTrue;
  setManualOnFalse: ISetManualOnFalse;
  setIsDrawAllObjectOnTrue?: ISetManualOnTrue;
  setIsDrawAllObjectOnFalse?: ISetManualOnFalse;
  handleFeatureClick: iHandleFeatureClick;
  handleAddDrawLines: IHandleDrawFeatureAdd;
  handleDrawFeatureClick: IHandleDrawFeatureClick;
  handleRemoveTargetDrawFeature: IHandleRemoveTargetDrawFeature;
};
