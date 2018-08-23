import { ActionsMonitorPage } from 'components/monitor/new/redux/models/actions-monitor-page.h';
import {
  FrontGeozonesDataByIndex
} from 'components/monitor/new/redux/models/monitor-page.h';

export type PropsLayerSelectedGeooobjects = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  selectedGeoobjects: FrontGeozonesDataByIndex;
  monitorPageRemoveFromSelectedGeoobjects: ActionsMonitorPage.monitorPageRemoveFromSelectedGeoobjects;
}

export type StateLayerSelectedGeooobjects = {
  selectedGeoobjects: FrontGeozonesDataByIndex;
};


export module LayerSelectedGeooobjects {
  export type renderGeoobjectsFunc = (
    geoobjects: FrontGeozonesDataByIndex,
    new_geoobjects: FrontGeozonesDataByIndex,
    thisProps: PropsLayerSelectedGeooobjects,
  ) => void;
}