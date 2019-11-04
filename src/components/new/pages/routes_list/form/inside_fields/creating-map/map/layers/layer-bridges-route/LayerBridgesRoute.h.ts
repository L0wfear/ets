import Map from 'ol/Map';
import Feature from 'ol/Feature';

import { GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';

import { ModifyBridgesForRoute } from 'components/new/pages/routes_list/form/RouteForm.h';
import { Company } from 'redux-main/reducers/modules/company/@types';

export type PropsLayerBridgesRoute = {
  bridges?: ModifyBridgesForRoute;
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer;
  getOlLayer: ETSCore.Map.InjectetLayerProps.FuncGetOlLayer;
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer;
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById;
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer;
  map: Map;
};

export type StateLayerBridgesRoute = {
};

type TypeGeoObjectDataIndex = {
  [id: string]: GeozonesDataByIndex;
};

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
    addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
    companiesIndex?: Record<Company['id'], Company>;
  };

  type checkShowFalseFuncThisProps = {
    removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  };

  type renderGeoobjectsFuncThisProps = checkShowTrueFuncThisProps & checkShowFalseFuncThisProps & {
    getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById;
    companiesIndex?: Record<Company['id'], Company>;
  };

  export type renderGeoobjectsFunc = (
    geoobjects: TypeGeoobjects,
    thisProps: renderGeoobjectsFuncThisProps,
  ) => void;

  export type checkShowTrueFunc = (
    serverName: string,
    id: string,
    geoobj: GeozonesDataByIndex & { state: number; },
    geoobj_old: GeozonesDataByIndex & { state: number; },
    oldFeature: Feature,
    thisProps: checkShowTrueFuncThisProps,
  ) => void;

  export type checkShowTrueHasOldFeatureFunc = (
    geoobj: GeozonesDataByIndex & { state: number; },
    geoobj_old: GeozonesDataByIndex & { state: number; },
    oldFeature: Feature,
  ) => void;

  export type checkShowTrueHasNotOldFeatureFunc = (
    serverName: string,
    id: string,
    geoobj: GeozonesDataByIndex & { state: number; },
    thisProps: checkShowTrueFuncThisProps,
  ) => void;
}
