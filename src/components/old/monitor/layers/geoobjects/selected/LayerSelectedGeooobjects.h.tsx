import { ActionsMonitorPage } from 'components/old/monitor/redux-main/models/actions-monitor-page.h';
import {
  FrontGeozonesDataByIndex
} from 'components/old/monitor/redux-main/models/monitor-page.h';

export type PropsLayerSelectedGeooobjects = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  selectedGeoobjects: FrontGeozonesDataByIndex;
  monitorPageRemoveFromSelectedGeoobjects: ActionsMonitorPage.monitorPageRemoveFromSelectedGeoobjects;
};

export type StateLayerSelectedGeooobjects = {
};

export namespace LayerSelectedGeooobjects {
  export type renderGeoobjectsFunc = (
    geoobjects: FrontGeozonesDataByIndex,
    new_geoobjects: FrontGeozonesDataByIndex,
    thisProps: PropsLayerSelectedGeooobjects,
  ) => void;
}
