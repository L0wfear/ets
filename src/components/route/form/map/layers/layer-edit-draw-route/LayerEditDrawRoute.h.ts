import { GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';
import { TypeCompaniesIndex } from 'redux-main/trash-actions/uniq/promise.h';

export type PropsLayerEditDrawRoute = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  getOlLayer: ETSCore.Map.InjectetLayerProps.FuncGetOlLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  drawObjectList: {
    object_id: number,
    shape: object,
    state: 2 | 3;
    type: 'odh' | 'dt' | 'points',
  }[],
  inputLines: any[];
  map: ol.Map;
  handleDrawFeatureClick: any;
};

export type StateLayerEditDrawRoute = {
};

interface TypeGeoObjectDataIndex {
  [id: string]: GeozonesDataByIndex;
}

export type TypeGeoObjectData = {
  show: boolean;
  data?: TypeGeoObjectDataIndex;
  oldData?: TypeGeoObjectDataIndex;
  
}

export type TypeGeoobjects = {
  [serverName: string]: TypeGeoObjectData;
};

export module InjectetLayerProps {
}

export module LayerGeoobjectsUtilsTypes {
  type checkShowTrueFuncThisProps = {
    addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
    companiesIndex?: TypeCompaniesIndex;
  }

  type checkShowFalseFuncThisProps = {
    removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  }

  type renderGeoobjectsFuncThisProps = checkShowTrueFuncThisProps & checkShowFalseFuncThisProps & {
    getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
    companiesIndex?: TypeCompaniesIndex;
  }

  export type renderGeoobjectsFunc = (
    geoobjects: TypeGeoobjects,
    thisProps: renderGeoobjectsFuncThisProps,
  ) => void;

  export type checkShowTrueFunc = (
    serverName: string,
    id: string,
    geoobj: GeozonesDataByIndex & { state: number },
    geoobj_old: GeozonesDataByIndex & { state: number },
    oldFeature: ol.Feature,
    thisProps: checkShowTrueFuncThisProps,
  ) => void;

  export type checkShowTrueHasOldFeatureFunc = (
    geoobj: GeozonesDataByIndex & { state: number },
    geoobj_old: GeozonesDataByIndex & { state: number },
    oldFeature: ol.Feature,
  ) => void;

  export type checkShowTrueHasNotOldFeatureFunc = (
    serverName: string,
    id: string,
    geoobj: GeozonesDataByIndex & { state: number },
    thisProps: checkShowTrueFuncThisProps,
  ) => void;
};
