import { GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';
import { TypeCompaniesIndex } from 'redux-main/trash-actions/uniq/promise.h';

export type PropsLayerEditGeoobjRoute = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  getOlLayer: ETSCore.Map.InjectetLayerProps.FuncGetOlLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  geoobjects: {
    [id: string]: {
      name: string;
      shape: object;
      state: 1 | 2 | 3;
    };
  };
  map: ol.Map;
  centerOn: any;
  handleFeatureClick: any;
};

export type StateLayerEditGeoobjRoute = {
};

interface TypeGeoObjectDataIndex {
  [id: string]: GeozonesDataByIndex;
}

export type TypeGeoObjectData = {
  show: boolean;
  data?: TypeGeoObjectDataIndex;
  oldData?: TypeGeoObjectDataIndex;
};

export type TypeGeoobjects = {
  [serverName: string]: TypeGeoObjectData;
};

export namespace InjectetLayerProps {
}

export namespace LayerGeoobjectsUtilsTypes {
  type checkShowTrueFuncThisProps = {
    addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
    companiesIndex?: TypeCompaniesIndex;
  };

  type checkShowFalseFuncThisProps = {
    removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  };

  type renderGeoobjectsFuncThisProps = checkShowTrueFuncThisProps & checkShowFalseFuncThisProps & {
    getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
    companiesIndex?: TypeCompaniesIndex;
  };

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
}
